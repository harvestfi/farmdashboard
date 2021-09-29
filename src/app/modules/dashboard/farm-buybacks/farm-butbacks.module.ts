import {NgModule} from '@angular/core';
import {ChartGeneralModule} from '@modules/chart/chart-general/chart-general.module';
import {FarmBuybacksComponent} from '@modules/dashboard/farm-buybacks/farm-buybacks.component';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';

@NgModule({
  imports: [
    ChartGeneralModule,
    ThemeSwitchModule,
    SideMenuToggleModule,
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
