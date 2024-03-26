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
import { PrefeituraFormComponent } from './pages/prefeitura/prefeitura-form/prefeitura-form.component';
import { PrefeituraGridComponent } from './pages/prefeitura/prefeitura-grid/prefeitura-grid.component';
import { AcessoGridComponent } from './pages/acessos/acesso-grid/acesso-grid.component';
import { AcessoFormComponent } from './pages/acessos/acesso-form/acesso-form.component';
import { ContratosGridComponent } from './pages/contratos/contratos-grid/contratos-grid.component';
import { ContratosFormComponent } from './pages/contratos/contratos-form/contratos-form.component';
import { CartorioFormComponent } from './pages/cartorio/cartorio-form/cartorio-form.component';
import { CartorioGridComponent } from './pages/cartorio/cartorio-grid/cartorio-grid.component';
import { VendaPagamentoFormComponent } from './pages/vendas-pagamentos/venda-pagamento-form/venda-pagamento-form.component';
import { VendaPagamentoGridComponent } from './pages/vendas-pagamentos/venda-pagamento-grid/venda-pagamento-grid.component';
import { ImovelFormComponent } from './pages/imoveis/imovel-form/imovel-form.component';
import { ImovelGridComponent } from './pages/imoveis/imovel-grid/imovel-grid.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},

  // Rotas de prefeitura
  { path: 'prefeitura', loadChildren: () => import('./pages/prefeitura/prefeitura.module').then(m => m.PrefeituraModule) },

  // Rotas de usuario
  { path: 'usuario', loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule) },

  // Rotas de funcionario
  { path: 'funcionario', loadChildren: () => import('./pages/funcionarios/funcionarios.module').then(m => m.FuncionariosModule) },

  // Rotas de contratante
  { path: 'contratante', loadChildren: () => import('./pages/contratantes/contratantes.module').then(m => m.ContratantesModule) },
  
  // Rotas de vendedor
  { path: 'vendedor', loadChildren: () => import('./pages/vendedores/vendedores.module').then(m => m.VendedoresModule) },

  // Rotas de acesso
  { path: 'acesso', loadChildren: () => import('./pages/acessos/acessos.module').then(m => m.AcessosModule) },

  // Rotas de contrato
  { path: 'contrato', loadChildren: () => import('./pages/contratos/contratos.module').then(m => m.ContratosModule) },

  // Rotas de vendasPagamentos
  { path: 'vendasPagamentos', loadChildren: () => import('./pages/vendas-pagamentos/vendas-pagamentos.module').then(m => m.VendaPagamentoModule) },

  // Rotas de cartorio
  { path: 'cartorio', loadChildren: () => import('./pages/cartorio/cartorio.module').then(m => m.CartorioModule) },

  // Rotas de imovel
  { path: 'imovel', loadChildren: () => import('./pages/imoveis/imovel.module').then(m => m.ImovelModule) },

];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
