import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ToolboxService } from '../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  }

  constructor(private authService: AuthService, private router: Router, private toolboxService: ToolboxService) {}
  ngOnInit(): void {

  }

  login(): void {
    this.authService.login(this.usuario.cpf, this.usuario.senha).subscribe(() => {
      if (this.authService.isLoggedIn) {
        const redirectUrl = this.authService.redirectUrl
          ? this.authService.redirectUrl
          : '/lista/usuarios';
        this.router.navigate([redirectUrl]);
      }else{
        this.toolboxService.showTooltip('error', 'Usuário ou senha incorreta!', 'ERRO!');
      }
    });
  }
}
