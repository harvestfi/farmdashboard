import {NgModule} from '@angular/core';

import {LinkWindowComponent} from './link-window.component';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
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
