import {NgModule} from '@angular/core';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

import {CustomModalComponent} from './custom-modal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    NgbModalModule,
    CommonModule,
  ],
  exports: [
    CustomModalComponent,
  ],
  declarations: [
    CustomModalComponent
  ],
  providers: [],
})
export class CustomModalModule {
}
