import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ImoveisService } from '../../../services/imoveis.service';

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
  constructor(private router: Router, private imoveisService: ImoveisService) {}
  addNew() {
    this.router.navigate(["/imovel/novo"]);
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.imoveisService.getItems().subscribe(imoveis => {
      if (imoveis.length >= 0) {
        this.dataSource = imoveis;
        this.dataSourceFilter = imoveis;
      }
    });
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((imovel: any) => imovel.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || imovel.contratante.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id]);
  }

  deleteItem(element: any){
    this.imoveisService.deleteItem(element.id);
    this.findAll();
  }
}
