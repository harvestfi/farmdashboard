import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

import {AddressComponent} from './address.component';

@NgModule({
  imports: [
    MatIconModule,
    CommonModule,
  ],
  exports: [
    AddressComponent,
  ],
  declarations: [
    AddressComponent,
  ],
  providers: [],
})
export class AddressModule {
}
