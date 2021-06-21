import {NgModule} from '@angular/core';

import {FlowTabComponent} from './flow-tab.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
  ],
  exports: [
    FlowTabComponent,
  ],
  declarations: [
    FlowTabComponent,
  ],
  providers: [],
})
export class FlowTabModule {
}
