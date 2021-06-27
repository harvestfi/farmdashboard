import {NgModule} from '@angular/core';

import {VaultTvlDialogComponent} from './vault-tvl-dialog.component';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule,
  ],
  exports: [
    VaultTvlDialogComponent,
  ],
  declarations: [
    VaultTvlDialogComponent,
  ],
  providers: [],
})
export class VaultTvlDialogModule {
}
