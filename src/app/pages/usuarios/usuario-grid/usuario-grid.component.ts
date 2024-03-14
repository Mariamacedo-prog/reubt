import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-usuario-grid',
  templateUrl: './usuario-grid.component.html',
  styleUrl: './usuario-grid.component.css'
})
export class UsuarioGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovoUsuario() {
    this.router.navigate(["/cadastrar/usuario"]);
  }

  limparPesquisa() {
    this.searchTerm = '';
  }


 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      console.log(storedDb)
      if (storedDb) {
        if(JSON.parse(storedDb).usuarios){
          this.dataSource = JSON.parse(storedDb).usuarios;
          this.dataSourceFilter = JSON.parse(storedDb).usuarios;
        }
      }
    }, 1000)
 
  }
  procurarNomeOuCpf() {
    this.dataSourceFilter = this.dataSource.filter((usuario: any) => usuario.nome.includes(this.searchTerm) || usuario.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    console.log(element)
    this.router.navigate(["/usuario/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.usuarios.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.usuarios.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Usuário foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.usuarios;
    this.dataSource = databaseInfo.usuarios;
  }
}
