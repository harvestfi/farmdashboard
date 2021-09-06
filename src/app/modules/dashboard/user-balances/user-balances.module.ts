import {NgModule} from '@angular/core';
import {UserBalancesComponent} from '@modules/dashboard/user-balances/user-balances.component';
import {CommonModule} from '@angular/common';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

@NgModule({
  imports: [
   CommonModule,
   ThemeSwitchModule,
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
