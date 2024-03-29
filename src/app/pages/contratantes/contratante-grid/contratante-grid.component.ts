import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-contratante-grid',
  templateUrl: './contratante-grid.component.html',
  styleUrl: './contratante-grid.component.css'
})
export class ContratanteGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'estado' ,'situacaoPagamento', 'cartorio','data','valoresReceber','valoresRecebidos', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

  cartorios: any = [];
  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovo() {
    this.router.navigate(["/contratante/novo"]);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        if(JSON.parse(storedDb).contratantes){
          this.dataSource = JSON.parse(storedDb).contratantes;
          this.dataSourceFilter = JSON.parse(storedDb).contratantes;
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
    
    this.dataSourceFilter = this.dataSource.filter((contratante: any) => contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contratante.cpf.includes(this.searchTerm));
   
    if(this.cartorioSearch != ''){
      this.dataSourceFilter = this.dataSourceFilter.filter((contratante: any) => contratante.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase()));
    }
   
  }

  visualizarItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.contratantes.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.contratantes.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Contratante foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.contratantes;
    this.dataSource = databaseInfo.contratantes;
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}
