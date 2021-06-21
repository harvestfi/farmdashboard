import {NgModule} from '@angular/core';

import {TradeBoxComponent} from './trade-box.component';
import {CommonModule} from '@angular/common';
import {PopoverModule} from '../../common/popover/popover.module';
import {IconsModule} from '../../static/components/icons/icons.module';
import {TransactionModule} from '../../static/components/transactions/transaction.module';

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
