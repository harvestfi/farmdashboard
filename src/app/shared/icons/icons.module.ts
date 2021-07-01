import {NgModule} from '@angular/core';

import {IconsComponent} from './icons.component';
import {CommonModule} from '@angular/common';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    IconsComponent,
  ],
  declarations: [
    IconsComponent,
  ],
  providers: [],
})
export class IconsModule {
}
