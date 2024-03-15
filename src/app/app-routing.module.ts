import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { UsuarioFormComponent } from './pages/usuarios/usuario-form/usuario-form.component';
import { UsuarioGridComponent } from './pages/usuarios/usuario-grid/usuario-grid.component';
import { FuncionarioFormComponent } from './pages/funcionarios/funcionario-form/funcionario-form.component';
import { FuncionarioGridComponent } from './pages/funcionarios/funcionario-grid/funcionario-grid.component';
import { ContratanteGridComponent } from './pages/contratantes/contratante-grid/contratante-grid.component';
import { ContratanteFormComponent } from './pages/contratantes/contratante-form/contratante-form.component';
import { VendedorFormComponent } from './pages/vendedores/vendedor-form/vendedor-form.component';
import { VendedorGridComponent } from './pages/vendedores/vendedor-grid/vendedor-grid.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},

  //usuario
  { path: 'novo/cadastro/usuario', component: UsuarioFormComponent},
  { path: 'usuario/:id', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'usuario/:id/:tela', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'cadastrar/usuario', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'lista/usuarios', component: UsuarioGridComponent, canActivate: [authGuard] },

  //funcionario
  { path: 'funcionario/:id', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'funcionario/:id/:tela', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'novo/funcionario', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'lista/funcionarios', component: FuncionarioGridComponent, canActivate: [authGuard] },

  //contratante
  { path: 'contratante/:id', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'contratante/:id/:tela', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'novo/contratante', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'lista/contratantes', component: ContratanteGridComponent, canActivate: [authGuard] },

    //contratante
    { path: 'vendedor/:id', component: VendedorFormComponent, canActivate: [authGuard] },
    { path: 'vendedor/:id/:tela', component: VendedorFormComponent, canActivate: [authGuard] },
    { path: 'novo/vendedor', component: VendedorFormComponent, canActivate: [authGuard] },
    { path: 'lista/vendedores', component: VendedorGridComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
