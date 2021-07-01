import {NgModule} from '@angular/core';

import {SimpleModalComponent} from './simple-modal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    SimpleModalComponent,
  ],
  declarations: [
    SimpleModalComponent,
  ],
  providers: [],
})
export class SimpleModalModule {
}
