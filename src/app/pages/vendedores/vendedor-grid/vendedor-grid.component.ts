import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-vendedor-grid',
  templateUrl: './vendedor-grid.component.html',
  styleUrl: './vendedor-grid.component.css'
})
export class VendedorGridComponent {
  displayedColumns: string[] = ['foto','nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovoVendedor() {
    this.router.navigate(["/vendedor/novo"]);
  }
 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      console.log(storedDb)
      if (storedDb) {
        if(JSON.parse(storedDb).vendedores){
          this.dataSource = JSON.parse(storedDb).vendedores;
          this.dataSourceFilter = JSON.parse(storedDb).vendedores;
        }
      }
    }, 1000)
  }
  
  procurar() {
    this.dataSourceFilter = this.dataSource.filter((vendedor: any) => vendedor.nome.includes(this.searchTerm) || vendedor.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.vendedores.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.vendedores.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Vendedor(a) foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.vendedores;
    this.dataSource = databaseInfo.vendedores;
  }
}
