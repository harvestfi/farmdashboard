import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardLastValuesComponent} from './dashboard-last-values.component';
import {PopoverModule} from '@shared/popover/popover.module';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {VaultTvlDialogModule} from '@modules/dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.module';
import {KatexModule} from 'ng-katex';
import {GasDialogModule} from '@modules/dialogs/gas-dialog/gas-dialog.module';
import {WeeklyProfitDialogModule} from '@modules/dialogs/weekly-profit-dialog/weekly-profit-dialog.module';
import {TvlV2DialogModule} from '@modules/dialogs/tvl-v2-dialog/tvl-v2-dialog.module';
import {FarmBuybacksDialogModule} from '@modules/dialogs/farm-buybacks-dialog/farm-buybacks-dialog.module';
import {SavedGasFeesDialogModule} from '@modules/dialogs/saved-gas-fees-dialog/saved-gas-fees-dialog.module';
import {TotalUsersDialogModule} from '@modules/dialogs/total-users-dialog/total-users-dialog.module';

@NgModule({
  imports: [
    PopoverModule,
    CustomModalModule,
    VaultTvlDialogModule,
    CommonModule,
    KatexModule,
    GasDialogModule,
    WeeklyProfitDialogModule,
    TvlV2DialogModule,
    FarmBuybacksDialogModule,
    SavedGasFeesDialogModule,
    TotalUsersDialogModule,
  ],
  exports: [
    DashboardLastValuesComponent,
  ],
  declarations: [
    DashboardLastValuesComponent,
  ],
  providers: [],
})
export class DashboardLastValuesModule {
}
