import {NgModule} from '@angular/core';

import {WeeklyProfitDialogComponent} from './weekly-profit-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    WeeklyProfitDialogComponent,
  ],
  declarations: [
    WeeklyProfitDialogComponent,
  ],
  providers: [],
})
export class WeeklyProfitDialogModule {
}
