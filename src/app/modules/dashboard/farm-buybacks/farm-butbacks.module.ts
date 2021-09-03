import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {FarmBuybacksComponent} from '@modules/dashboard/farm-buybacks/farm-buybacks.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule
  ],
  exports: [
      FarmBuybacksComponent,
  ],
  declarations: [
      FarmBuybacksComponent,
  ],
  providers: [],
})
export class FarmBuybacksModule {
}
