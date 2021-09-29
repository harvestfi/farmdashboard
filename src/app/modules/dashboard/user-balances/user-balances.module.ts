import {NgModule} from '@angular/core';
import {UserBalancesComponent} from '@modules/dashboard/user-balances/user-balances.component';
import {CommonModule} from '@angular/common';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';

@NgModule({
  imports: [
   CommonModule,
   ThemeSwitchModule,
   SideMenuToggleModule,
  ],
  exports: [
   UserBalancesComponent
  ],
  declarations: [
    UserBalancesComponent,
  ],
  providers: [],
})
export class UserBalancesModule {
}
