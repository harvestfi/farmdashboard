import {NgModule} from '@angular/core';
import {UserBalancesComponent} from '@modules/dashboard/user-balances/user-balances.component';
import {CommonModule} from '@angular/common';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ThemeSwitchModule,
    SideMenuToggleModule,
    RouterModule,
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
