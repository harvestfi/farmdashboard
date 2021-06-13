import {NgModule} from '@angular/core';

import {Web3chartsComponent} from './web3charts.component';
import {Web3chartComponent} from './components/web3chart/web3chart.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Web3chartsRoutingModule} from './web3charts-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Web3chartsRoutingModule,
  ],
  exports: [
    Web3chartsComponent,
    Web3chartComponent,
  ],
  declarations: [
    Web3chartsComponent,
    Web3chartComponent,
  ],
  providers: [],
})
export class Web3ChartsModule {
}
