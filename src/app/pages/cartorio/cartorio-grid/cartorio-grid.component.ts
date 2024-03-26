import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-cartorio-grid',
  templateUrl: './cartorio-grid.component.html',
  styleUrl: './cartorio-grid.component.css'
})
export class CartorioGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cns', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovaCartorio() {
    this.router.navigate(["/cartorio/novo"]);
  }
 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      console.log(storedDb)
      if (storedDb) {
        if(JSON.parse(storedDb).cartorios){
          this.dataSource = JSON.parse(storedDb).cartorios;
          this.dataSourceFilter = JSON.parse(storedDb).cartorios;
        }
      }
    }, 1000)
  }
  
  procurar() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.cartorios.nome.includes(this.searchTerm) || item.cartorios.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.cartorios.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.cartorios.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Cartorio foi deletada com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.cartorios;
    this.dataSource = databaseInfo.cartorios;
  }
}
