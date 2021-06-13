import {NgModule} from '@angular/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CommonModule} from '@angular/common';

import {HardworkTradeComponent} from './hardwork-trade/hardwork-trade.component';
import {HardworkFlowTabComponent} from './hardwork-flow-tab/hardwork-flow-tab.component';
import {HardworkTxComponent} from './hardwork-tx/hardwork-tx.component';
import {HardworkHeaderComponent} from './hardwork-header/hardwork-header.component';
import {HardworkFilterPipe} from './hardwork-filter.pipe';
import {PopoverModule} from '../../common/popover/popover.module';
import {IconsModule} from '../../static/components/icons/icons.module';
import {TransactionModule} from '../../static/components/transactions/transaction.module';
import {FormsModule} from '@angular/forms';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {HardworkHistoryListDialogComponent} from './hardwork-history-list-dialog/hardwork-history-list-dialog.component';
import {PaginatorModule} from '../../common/paginator/paginator.module';
import {LoadingSpinnerModule} from '../../main/loading-spinner/loading-spinner.module';


@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    PopoverModule,
    IconsModule,
    TransactionModule,
    FormsModule,
    CustomModalModule,
    PaginatorModule,
    LoadingSpinnerModule,
  ],
  exports: [
    HardworkTxComponent,
  ],
  declarations: [
    HardworkHistoryListDialogComponent,
    HardworkTradeComponent,
    HardworkFlowTabComponent,
    HardworkTxComponent,
    HardworkHeaderComponent,
    HardworkFilterPipe,
  ],
  providers: [],
})
export class HardworkFlowCardModule {
}
