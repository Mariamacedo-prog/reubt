import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-funcionario-grid',
  templateUrl: './funcionario-grid.component.html',
  styleUrl: './funcionario-grid.component.css'
})
export class FuncionarioGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovoFuncionario() {
    this.router.navigate(["/novo/funcionario"]);
  }
 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      console.log(storedDb)
      if (storedDb) {
        if(JSON.parse(storedDb).funcionarios){
          this.dataSource = JSON.parse(storedDb).funcionarios;
          this.dataSourceFilter = JSON.parse(storedDb).funcionarios;
        }
      }
    }, 1000)
 
  }
  procurarNomeOuCpf() {
    this.dataSourceFilter = this.dataSource.filter((funcionario: any) => funcionario.nome.includes(this.searchTerm) || funcionario.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/funcionario/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/funcionario/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.funcionarios.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.funcionarios.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Funcionario foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.funcionarios;
    this.dataSource = databaseInfo.funcionarios;
  }
}
