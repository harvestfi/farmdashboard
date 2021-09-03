import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {WeeklyProfitHistoryComponent} from '@modules/dashboard/weekly-profit-history/weekly-profit-history.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule
  ],
  exports: [
      WeeklyProfitHistoryComponent,
  ],
  declarations: [
      WeeklyProfitHistoryComponent,
  ],
  providers: [],
})
export class WeeklyProfitHistoryModule {
}
