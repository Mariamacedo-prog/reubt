import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-prefeitura-grid',
  templateUrl: './prefeitura-grid.component.html',
  styleUrl: './prefeitura-grid.component.css'
})
export class PrefeituraGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovaPrefeitura() {
    this.router.navigate(["/nova/prefeitura"]);
  }
 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      console.log(storedDb)
      if (storedDb) {
        if(JSON.parse(storedDb).prefeituras){
          this.dataSource = JSON.parse(storedDb).prefeituras;
          this.dataSourceFilter = JSON.parse(storedDb).prefeituras;
        }
      }
    }, 1000)
  }
  
  procurar() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.prefeitura.nome.includes(this.searchTerm) || item.prefeitura.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/prefeitura/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/prefeitura/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.prefeituras.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.prefeituras.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Prefeitura foi deletada com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.prefeituras;
    this.dataSource = databaseInfo.prefeituras;
  }
}
