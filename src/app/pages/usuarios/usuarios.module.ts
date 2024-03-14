import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { UsuarioGridComponent } from './usuario-grid/usuario-grid.component';
import { UsuariosComponent } from './usuario-form/usuarios.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from '../../app-routing.module';


@NgModule({
  declarations: [UsuarioGridComponent,UsuariosComponent ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule
  ]
})
export class UsuariosModule { }