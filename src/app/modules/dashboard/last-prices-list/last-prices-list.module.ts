import {NgModule} from '@angular/core';

import {LastPricesListComponent} from './last-prices-list.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    LastPricesListComponent,
  ],
  declarations: [
    LastPricesListComponent,
  ],
  providers: [],
})
export class LastPricesListModule {
}
