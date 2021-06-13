import {NgModule} from '@angular/core';

import {MainPageComponent} from './main-page.component';
import {DashboardLastValuesModule} from '../../dashboard/dashboard-last-values/dashboard-last-values.module';
import {StrategyListModule} from '../../dashboard/strategy-list/strategy-list.module';
import {PriceChartModule} from '../../chart/price-chart/price-chart.module';
import {FlowCardsViewModule} from '../../flow-cards/flow-cards-view/flow-cards-view.module';
import {LastPricesListModule} from '../../dashboard/last-prices-list/last-prices-list.module';
import {CommonModule} from '@angular/common';
import {MainPageRoutingModule} from './main-page-routing.module';

@NgModule({
  imports: [
    MainPageRoutingModule,
    DashboardLastValuesModule,
    StrategyListModule,
    PriceChartModule,
    FlowCardsViewModule,
    LastPricesListModule,
    CommonModule,
  ],
  exports: [
    MainPageComponent,
  ],
  declarations: [
    MainPageComponent,
  ],
  providers: [],
})
export class MainPageModule {
}
