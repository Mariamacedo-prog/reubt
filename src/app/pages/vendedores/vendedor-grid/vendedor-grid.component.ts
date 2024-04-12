import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { VendedoresService } from '../../../services/vendedores.service';

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
  constructor(private router: Router, private toolboxService: ToolboxService, private vendedoresService: VendedoresService) {}

 
  ngOnInit(): void {
    this.findAll();
  }
  
  findAll(){
    this.vendedoresService.getItems().subscribe(vendedores => {
      if (vendedores.length >= 0) {
        this.dataSource = vendedores;
        this.dataSourceFilter = vendedores;
      }
    });
  }

  addNewVendedor() {
    this.router.navigate(["/vendedor/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((vendedor: any) => vendedor.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || vendedor.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id]);
  }

  deleteItem(element: any){
    this.vendedoresService.deleteItem(element.id);
    this.findAll();
  }
}
