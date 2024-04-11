import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { UsuariosService } from '../../../services/usuarios.service';

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
  constructor(private router: Router, private toolboxService: ToolboxService, private usuariosService: UsuariosService) {}
  adicionarNovoUsuario() {
    this.router.navigate(["/usuario/novo"]);
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.usuariosService.getItems().subscribe(usuarios => {
        if (usuarios.length > 0) {
          this.dataSource = usuarios;
          this.findAllUsers();
          this.dataSourceFilter = usuarios;
        }
      });
    }, 1000)
  }
  
  findUser() {
    this.dataSourceFilter = this.dataSource.filter((usuario: any) => usuario.nome.includes(this.searchTerm) || usuario.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }
  
  viewItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id]);
  }

  findAllUsers(){
    this.usuariosService.getItems().subscribe(usuarios => {
      if (usuarios.length > 0) {
        this.dataSource = usuarios;
        this.dataSourceFilter = usuarios;
      }
    });
  }

  deleteItem(element: any){
    this.usuariosService.deleteItem(element.id);
    this.findAllUsers();
  }
}
