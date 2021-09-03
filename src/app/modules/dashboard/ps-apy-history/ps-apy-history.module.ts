import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {PsApyHistoryComponent} from '@modules/dashboard/ps-apy-history/ps-apy-history.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule
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
