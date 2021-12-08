import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {WeeklyProfitHistoryComponent} from '@modules/dashboard/weekly-profit-history/weekly-profit-history.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule,
    SideMenuToggleModule,
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
