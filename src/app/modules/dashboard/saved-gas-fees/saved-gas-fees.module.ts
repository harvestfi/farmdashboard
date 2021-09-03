import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {SavedGasFeesComponent} from '@modules/dashboard/saved-gas-fees/saved-gas-fees.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule
  ],
  exports: [
      SavedGasFeesComponent,
  ],
  declarations: [
      SavedGasFeesComponent,
  ],
  providers: [],
})
export class SavedGasFeesModule {
}
