import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-contratos-grid',
  templateUrl: './contratos-grid.component.html',
  styleUrl: './contratos-grid.component.css'
})
export class ContratosGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'statusEntrega', 'cartorio','crfEntregue','nCrf', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

  cartorios: any = [];
  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovo() {
    this.router.navigate(["/contrato/novo"]);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        if(JSON.parse(storedDb).contratos){
          this.dataSource = JSON.parse(storedDb).contratos;
          this.dataSourceFilter = JSON.parse(storedDb).contratos;
        }
        if(JSON.parse(storedDb).cartorios){
          this.cartorios = JSON.parse(storedDb).cartorios;
        }
      }
    }, 1000)
  }

  procurar() {
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }

    this.dataSourceFilter = this.dataSource.filter((contrato: any) => contrato.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contrato.contratante.cpf.includes(this.searchTerm));
 
    if(this.cartorioSearch != ''){
      this.dataSourceFilter = this.dataSourceFilter.filter((contrato: any) => contrato.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase()));
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.contratos.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.contratos.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Contrato foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.contratos;
    this.dataSource = databaseInfo.contratos;
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}
