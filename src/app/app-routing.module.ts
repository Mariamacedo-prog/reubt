import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { UsuarioFormComponent } from './pages/usuarios/usuario-form/usuario-form.component';
import { UsuarioGridComponent } from './pages/usuarios/usuario-grid/usuario-grid.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'novo/cadastro/usuario', component: UsuarioFormComponent},
  { path: 'usuario/:id', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'cadastrar/usuario', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'lista/usuarios', component: UsuarioGridComponent, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
