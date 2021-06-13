import {NgModule} from '@angular/core';
import {HarvestTxComponent} from './harvest-tx/harvest-tx.component';
import {HarvestFlowTabComponent} from './harvest-flow-tab/harvest-flow-tab.component';
import {HarvestFilterPipe} from './harvest-filter.pipe';
import {HarvestTradeComponent} from './harvest-trade/harvest-trade.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CommonModule} from '@angular/common';
import {SimpleModalModule} from '../../dialogs/simple-modal/simple-modal.module';
import {LinkWindowModule} from '../link-window/link-window.module';
import {MatIconModule} from '@angular/material/icon';
import {PopoverModule} from '../../common/popover/popover.module';
import {IconsModule} from '../../static/components/icons/icons.module';
import {FormsModule} from '@angular/forms';
import {HarvestHistoryDialogComponent} from './harvest-history-dialog/harvest-history-dialog.component';
import {PaginatorModule} from '../../common/paginator/paginator.module';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {SnackBarModule} from '../../main/snack-bar/snack-bar.module';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    SimpleModalModule,
    LinkWindowModule,
    MatIconModule,
    PopoverModule,
    IconsModule,
    FormsModule,
    PaginatorModule,
    CustomModalModule,
    SnackBarModule,
  ],
  exports: [
    HarvestTxComponent,
  ],
  declarations: [
    HarvestTxComponent,
    HarvestFlowTabComponent,
    HarvestFilterPipe,
    HarvestTradeComponent,
    HarvestHistoryDialogComponent,
  ],
  providers: [],
})
export class HarvestFlowCardModule {
}
