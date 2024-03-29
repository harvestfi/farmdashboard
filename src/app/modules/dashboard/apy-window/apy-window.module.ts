import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

import {ApyWindowComponent} from './apy-window.component';
import {VaultComponent} from './vault.component';
import {StrategyComponent} from './strategy.component';
import {PoolComponent} from './pool.component';
import {ApyCommonComponent} from './apy-common.component';
import {IconsModule} from '@shared/icons/icons.module';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {AddressModule} from '@shared/addresses/address.module';
import {ApyChartDialogModule} from '@modules/dialogs/charts/apy-chart-dialog/apy-chart-dialog.module';
import {PsApyDialogModule} from '@modules/dialogs/charts/ps-apy-dialog/ps-apy-dialog.module';
import { VaultTvlDialogModule } from '@modules/dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.module';

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
    VaultTvlDialogModule,
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
