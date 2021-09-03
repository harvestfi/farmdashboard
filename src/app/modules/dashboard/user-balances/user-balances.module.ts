import {NgModule} from '@angular/core';
import {UserBalancesComponent} from '@modules/dashboard/user-balances/user-balances.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
   CommonModule
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
