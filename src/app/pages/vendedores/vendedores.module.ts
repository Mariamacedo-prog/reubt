import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorFormComponent } from './vendedor-form/vendedor-form.component';
import { VendedorGridComponent } from './vendedor-grid/vendedor-grid.component';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [VendedorFormComponent, VendedorGridComponent],
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
    MatCardModule,
    MatAutocompleteModule
  ]
})
export class VendedoresModule { }
