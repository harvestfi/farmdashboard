import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

import {ApyWindowComponent} from './apy-window.component';
import {VaultComponent} from './vault.component';
import {StrategyComponent} from './strategy.component';
import {PoolComponent} from './pool.component';
import {ApyCommonComponent} from './apy-common.component';
import {IconsModule} from '../../static/components/icons/icons.module';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {AddressModule} from '../../static/components/addresses/address.module';
import {ApyChartDialogModule} from '../../dialogs/charts/apy-chart-dialog/apy-chart-dialog.module';
import {PsApyDialogModule} from '../../dialogs/charts/ps-apy-dialog/ps-apy-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    IconsModule,
    MatTabsModule,
    CustomModalModule,
    AddressModule,
    ApyChartDialogModule,
    PsApyDialogModule,
  ],
  exports: [
    ApyWindowComponent,
  ],
  declarations: [
    ApyCommonComponent,
    ApyWindowComponent,
    PoolComponent,
    StrategyComponent,
    VaultComponent,
  ],
  providers: [],
})
export class ApyWindowModule {
}
