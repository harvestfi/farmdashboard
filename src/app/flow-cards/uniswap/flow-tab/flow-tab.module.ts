import {NgModule} from '@angular/core';

import {FlowTabComponent} from './flow-tab.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
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
