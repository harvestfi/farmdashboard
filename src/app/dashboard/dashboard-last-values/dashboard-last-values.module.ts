import {NgModule} from '@angular/core';

import {DashboardLastValuesComponent} from './dashboard-last-values.component';
import {CommonModule} from '@angular/common';
import {PopoverModule} from '../../common/popover/popover.module';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {VaultTvlDialogModule} from '../../dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.module';
import {KatexModule} from 'ng-katex';
import {FarmBuybacksDialogComponent} from './dialogs/farm-buybacks-dialog/farm-buybacks-dialog.component';
import {SavedGasFeesDialogComponent} from './dialogs/saved-gas-fees-dialog/saved-gas-fees-dialog.component';
import {TvlV2DialogComponent} from './dialogs/tvl-v2-dialog/tvl-v2-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';
import {GasDialogComponent} from './dialogs/gas-dialog/gas-dialog.component';
import {WeeklyProfitDialogComponent} from './dialogs/weekly-profit-dialog/weekly-profit-dialog.component';
import {TotalUsersDialogComponent} from './dialogs/total-users-dialog/total-users-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule,
    CustomModalModule,
    VaultTvlDialogModule,
    KatexModule,
    ChartGeneralModule,
  ],
  exports: [
    DashboardLastValuesComponent,
  ],
  declarations: [
    DashboardLastValuesComponent,
    FarmBuybacksDialogComponent,
    SavedGasFeesDialogComponent,
    TvlV2DialogComponent,
    GasDialogComponent,
    WeeklyProfitDialogComponent,
    TotalUsersDialogComponent,
  ],
  providers: [],
})
export class DashboardLastValuesModule {
}
