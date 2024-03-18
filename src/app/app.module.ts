import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from './auth/auth.service';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { UsuariosModule } from './pages/usuarios/usuarios.module';
import { FuncionariosModule } from './pages/funcionarios/funcionarios.module';
import { ContratantesModule } from './pages/contratantes/contratantes.module';
import { VendedoresModule } from './pages/vendedores/vendedores.module';
import { PrefeituraModule } from './pages/prefeitura/prefeitura.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AcessosModule } from './pages/acessos/acessos.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    ToolboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    UsuariosModule,
    FuncionariosModule,
    ContratantesModule,
    VendedoresModule,
    PrefeituraModule,
    AcessosModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
