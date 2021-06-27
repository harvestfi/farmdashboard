import {NgModule} from '@angular/core';

import {PopoverComponent} from './popover.component';
import {CommonModule} from '@angular/common';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    CommonModule,
    NgbPopoverModule,
  ],
  exports: [
    PopoverComponent,
  ],
  declarations: [
    PopoverComponent,
  ],
  providers: [],
})
export class PopoverModule {
}
