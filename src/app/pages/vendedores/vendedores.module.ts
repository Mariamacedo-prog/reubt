import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorFormComponent } from './vendedor-form/vendedor-form.component';
import { VendedorGridComponent } from './vendedor-grid/vendedor-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import { InputfileModule } from '../../components/inputfile/inputfile.module';

const routes: Routes = [
  { path: 'form/:id', component: VendedorFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: VendedorFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: VendedorFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: VendedorGridComponent, canActivate: [authGuard] }
];

@NgModule({
  declarations: [VendedorFormComponent, VendedorGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    InputfileModule ,
    RouterModule.forChild(routes)
  ]
})
export class VendedoresModule { }
