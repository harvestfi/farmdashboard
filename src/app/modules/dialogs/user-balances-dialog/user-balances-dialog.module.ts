import {NgModule} from '@angular/core';

import {UserBalancesDialogComponent} from './user-balances-dialog.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    UserBalancesDialogComponent,
  ],
  declarations: [
    UserBalancesDialogComponent,
  ],
  providers: [],
})
export class UserBalancesDialogModule {
}
