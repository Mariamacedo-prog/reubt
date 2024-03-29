import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagamentoCalculoComponent } from './pagamento-calculo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [PagamentoCalculoComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule
  ],
  exports: [PagamentoCalculoComponent] 
})
export class PagamentoCalculoModule { }
