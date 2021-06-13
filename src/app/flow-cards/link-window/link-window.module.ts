import {NgModule} from '@angular/core';

import {LinkWindowComponent} from './link-window.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    MatIconModule,
  ],
  exports: [
    LinkWindowComponent,
  ],
  declarations: [
    LinkWindowComponent,
  ],
  providers: [],
})
export class LinkWindowModule {
}
