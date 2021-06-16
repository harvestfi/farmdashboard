import {NgModule} from '@angular/core';

import {ApyChartDialogComponent} from './apy-chart-dialog.component';
import {ChartGeneralModule} from '../../../chart/chart-general/chart-general.module';

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
