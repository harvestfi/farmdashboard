import {NgModule} from '@angular/core';

import {SimpleChartDialogComponent} from './simple-chart-dialog.component';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    SimpleChartDialogComponent,
  ],
  declarations: [
    SimpleChartDialogComponent,
  ],
  providers: [],
})
export class SimpleChartDialogModule {
}
