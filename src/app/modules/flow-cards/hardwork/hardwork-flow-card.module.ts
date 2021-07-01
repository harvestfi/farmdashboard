import {NgModule} from '@angular/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CommonModule} from '@angular/common';

import {HardworkTradeComponent} from './hardwork-trade/hardwork-trade.component';
import {HardworkFlowTabComponent} from './hardwork-flow-tab/hardwork-flow-tab.component';
import {HardworkTxComponent} from './hardwork-tx/hardwork-tx.component';
import {HardworkHeaderComponent} from './hardwork-header/hardwork-header.component';
import {HardworkFilterPipe} from './hardwork-filter.pipe';
import {PopoverModule} from '@shared/popover/popover.module';
import {IconsModule} from '@shared/icons/icons.module';
import {TransactionModule} from '@shared/transactions/transaction.module';
import {FormsModule} from '@angular/forms';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {HardworkHistoryListDialogComponent} from './hardwork-history-list-dialog/hardwork-history-list-dialog.component';
import {PaginatorModule} from '@shared/paginator/paginator.module';
import {LoadingSpinnerModule} from '@shared/loading-spinner/loading-spinner.module';
import {SnackBarModule} from '@shared/snack-bar/snack-bar.module';


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
    SnackBarModule,
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
