import {NgModule} from '@angular/core';

import {TradeBoxComponent} from './trade-box.component';
import {CommonModule} from '@angular/common';
import {PopoverModule} from '@shared/popover/popover.module';
import {IconsModule} from '@shared/icons/icons.module';
import {TransactionModule} from '@shared/transactions/transaction.module';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule,
    IconsModule,
    TransactionModule
  ],
  exports: [
    TradeBoxComponent,
  ],
  declarations: [
    TradeBoxComponent,
  ],
  providers: [],
})
export class TradeBoxModule {
}
