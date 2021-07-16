import {NgModule} from '@angular/core';

import {ApyChartDialogComponent} from './apy-chart-dialog.component';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    ApyChartDialogComponent,
  ],
  declarations: [
    ApyChartDialogComponent,
  ],
  providers: [],
})
export class ApyChartDialogModule {
}
