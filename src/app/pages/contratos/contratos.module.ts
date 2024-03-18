import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratosGridComponent } from './contratos-grid/contratos-grid.component';
import { ContratosFormComponent } from './contratos-form/contratos-form.component';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputfileModule } from '../../components/inputfile/inputfile.module';


@NgModule({
  declarations: [ ContratosGridComponent, ContratosFormComponent ],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    InputfileModule 
  ]
})
export class ContratosModule { }
