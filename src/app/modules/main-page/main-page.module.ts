import {NgModule} from '@angular/core';
import {MainPageComponent} from './main-page.component';
import {DashboardLastValuesModule} from '@modules/dashboard/dashboard-last-values/dashboard-last-values.module';
import {StrategyListModule} from '@modules/dashboard/strategy-list/strategy-list.module';
import {PriceChartModule} from '@modules/chart/price-chart/price-chart.module';
import {FlowCardsViewModule} from '@modules/flow-cards/flow-cards-view/flow-cards-view.module';
import {LastPricesListModule} from '@modules/dashboard/last-prices-list/last-prices-list.module';
import {CommonModule} from '@angular/common';
import {MainPageRoutingModule} from './main-page-routing.module';
import {VaultStatsComponent} from '../dashboard/vault-stats/vault-stats.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {EchartComponent} from '@modules/dashboard/vault-stats/echart/echart.component';
import {LayoutModule} from '@layout/layout.module';
import {PsApyHistoryComponent} from '@modules/dashboard/ps-apy-history/ps-apy-history.component';
import {VaultStatsTotalComponent} from '@modules/dashboard/vault-stats-total/vault-stats-total.component';

@NgModule({
  imports: [
    MainPageRoutingModule,
    DashboardLastValuesModule,
    StrategyListModule,
    PriceChartModule,
    FlowCardsViewModule,
    LastPricesListModule,
    LayoutModule,
    CommonModule,
    NgxEchartsModule.forRoot({
       echarts: () => import('echarts')
    }),
  ],
  exports: [
    MainPageComponent,
  ],
  declarations: [
    MainPageComponent,
    VaultStatsComponent,
    VaultStatsTotalComponent,
    EchartComponent,
  ],
  providers: [],
})
export class MainPageModule {
}
