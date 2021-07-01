import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaginatorComponent} from './paginator.component';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PaginatorComponent,
  ],
  declarations: [
    PaginatorComponent,
  ],
  providers: [],
})
export class PaginatorModule {
}
