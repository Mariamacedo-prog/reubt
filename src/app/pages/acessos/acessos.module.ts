import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcessoGridComponent } from './acesso-grid/acesso-grid.component';
import { AcessoFormComponent } from './acesso-form/acesso-form.component';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AcessoGridComponent,
    AcessoFormComponent
  ],
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
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule
  ]
})
export class AcessosModule { }
