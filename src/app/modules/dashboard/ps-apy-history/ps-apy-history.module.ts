import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {PsApyHistoryComponent} from '@modules/dashboard/ps-apy-history/ps-apy-history.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule,
    SideMenuToggleModule,
  ],
  exports: [
      PsApyHistoryComponent,
  ],
  declarations: [
      PsApyHistoryComponent,
  ],
  providers: [],
})
export class PsApyHistoryModule {
}
