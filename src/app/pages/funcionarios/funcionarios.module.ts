import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioGridComponent } from './funcionario-grid/funcionario-grid.component';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form.component';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [FuncionarioGridComponent, FuncionarioFormComponent ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule
  ]
})
export class FuncionariosModule { }
