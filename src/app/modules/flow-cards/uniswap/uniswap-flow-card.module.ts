import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AngularEmojisModule} from 'angular-emojis';

import {UniswapFilterPipe} from './uniswap-filter.pipe';
import {UniTxComponent} from './uni-tx/uni-tx.component';
import {UniTradeComponent} from './uni-trade/uni-trade.component';
import {SimpleModalModule} from '@shared/simple-modal/simple-modal.module';
import {LinkWindowModule} from '../link-window/link-window.module';
import {PopoverModule} from '@shared/popover/popover.module';
import {FormsModule} from '@angular/forms';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {UniHistoryDialogComponent} from './uni-history-dialog/uni-history-dialog.component';
import {FlowTabModule} from './flow-tab/flow-tab.module';
import {PaginatorModule} from '@shared/paginator/paginator.module';

@NgModule({
  imports: [
    SimpleModalModule,
    LinkWindowModule,
    PopoverModule,
    CommonModule,
    MatIconModule,
    AngularEmojisModule,
    FormsModule,
    CustomModalModule,
    FlowTabModule,
    PaginatorModule,
  ],
  exports: [
    UniswapFilterPipe,
    UniTradeComponent,
    UniTxComponent,
  ],
  declarations: [
    UniswapFilterPipe,
    UniTxComponent,
    UniTradeComponent,
    UniHistoryDialogComponent,
  ],
  providers: [],
})
export class UniswapFlowCardModule {
}
