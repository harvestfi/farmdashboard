import {NgModule} from '@angular/core';

import {TransactionComponent} from './transaction.component';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    MatIconModule,
    CommonModule
  ],
  exports: [
    TransactionComponent,
  ],
  declarations: [
    TransactionComponent,
  ],
  providers: [],
})
export class TransactionModule {
}
