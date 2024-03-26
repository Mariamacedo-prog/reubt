import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-imovel-grid',
  templateUrl: './imovel-grid.component.html',
  styleUrl: './imovel-grid.component.css'
})
export class ImovelGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade',  'nucleo', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovo() {
    this.router.navigate(["/imovel/novo"]);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        if(JSON.parse(storedDb).imoveis){
          this.dataSource = JSON.parse(storedDb).imoveis;
          this.dataSourceFilter = JSON.parse(storedDb).imoveis;
        }
      }
    }, 1000)
  }

  procurar() {
    this.dataSourceFilter = this.dataSource.filter((imovel: any) => imovel.contratante.nome.includes(this.searchTerm) || imovel.contratante.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.imoveis.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.imoveis.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Imovel foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.imoveis;
    this.dataSource = databaseInfo.imoveis;
  }
}
