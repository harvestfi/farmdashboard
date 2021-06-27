import {NgModule} from '@angular/core';

import {PriceChartComponent} from './price-chart.component';
import {FormsModule} from '@angular/forms';
import {GrainChartModule} from '../grain-chart/grain-chart.module';
import {FarmChartModule} from '../farm-chart/farm-chart.module';
import {OhlcBarComponent} from '../ohlc-bar/ohlc-bar.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrainChartModule,
    FarmChartModule,
  ],
  exports: [
    PriceChartComponent,
  ],
  declarations: [
    PriceChartComponent,
    OhlcBarComponent,
  ],
  providers: [],
})
export class PriceChartModule {
}
