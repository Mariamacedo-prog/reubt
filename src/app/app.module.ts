import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ImovelModule } from './pages/imoveis/imovel.module';
import { PagamentoCalculoComponent } from './components/pagamento-calculo/pagamento-calculo.component';

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
    MatButtonModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
