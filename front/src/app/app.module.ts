import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientModule} from '@angular/common/http';
import {FarmChartComponent} from './chart/farm-chart/farm-chart.component';
import {UniTxComponent} from './uniswap/uni-tx/uni-tx.component';
import {MatCardModule} from '@angular/material/card';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {FlowTabComponent} from './uniswap/flow-tab/flow-tab.component';
import {MatIconModule} from '@angular/material/icon';
import {HarvestTxComponent} from './harvest/harvest-tx/harvest-tx.component';
import {HarvestFlowTabComponent} from './harvest/harvest-flow-tab/harvest-flow-tab.component';
import {AngularEmojisModule} from 'angular-emojis';
import {HarvestFilterPipe} from './harvest/harvest-filter.pipe';
import {UniswapFilterPipe} from './uniswap/uniswap-filter.pipe';
import {DashboardLastValuesComponent} from './dashboard/dashboard-last-values/dashboard-last-values.component';
import {TvlBoxComponent} from './dashboard/tvl-box/tvl-box.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {TvlDialogComponent} from './dialogs/tvl-dialog/tvl-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {MainPageDescktopComponent} from './main/main-page-descktop/main-page-descktop.component';
import {MainPageMobileComponent} from './main/main-page-mobile/main-page-mobile.component';
import {MainPageViewComponent} from './main/main-page-view/main-page-view.component';
import {StrategyListComponent} from './dashboard/strategy-list/strategy-list.component';
import {MainFooterComponent} from './main/main-footer/main-footer.component';
import {CommonModule} from '@angular/common';
import { MainPageV2Component } from './main/main-page-v2/main-page-v2.component';
import { CenterViewComponent } from './main/center-view/center-view.component';
import { UniTradeComponent } from './uniswap/uni-trade/uni-trade.component';
import {FormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SidebarModule} from 'ng-sidebar';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { SnackBarComponent } from './main/snack-bar/snack-bar.component';
import { AllStatsDialogComponent } from './dialogs/all-stats-dialog/all-stats-dialog.component';
import {MatSortModule} from '@angular/material/sort';
import { LoadingSpinnerComponent } from './main/loading-spinner/loading-spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { IncomeDialogComponent } from './dialogs/income-dialog/income-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {environment} from '../environments/environment';
import { ProfitDialogComponent } from './dialogs/profit-dialog/profit-dialog.component';
import { GrainChartComponent } from './chart/grain-chart/grain-chart.component';
import { FarmBuybacksDialogComponent } from './dialogs/farm-buybacks-dialog/farm-buybacks-dialog.component';
import { HistoryPageComponent } from './history/history-page/history-page.component';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import { MainComponentsComponent } from './main/main-components/main-components.component';
import { StakedBoxComponent } from './history/staked-box/staked-box.component';
import { TradeBoxComponent } from './history/trade-box/trade-box.component';
import { HardWorkHistoryDialogComponent } from './dialogs/hard-work-history-dialog/hard-work-history-dialog.component';
import { TotalUsersDialogComponent } from './dialogs/total-users-dialog/total-users-dialog.component';
import { RewardsDialogComponent } from './dialogs/rewards-dialog/rewards-dialog.component';

declare var require: any;

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    FarmChartComponent,
    UniTxComponent,
    FlowTabComponent,
    HarvestTxComponent,
    HarvestFlowTabComponent,
    HarvestFilterPipe,
    UniswapFilterPipe,
    DashboardLastValuesComponent,
    TvlBoxComponent,
    TvlDialogComponent,
    MainPageDescktopComponent,
    MainPageMobileComponent,
    MainPageViewComponent,
    StrategyListComponent,
    MainFooterComponent,
    MainPageV2Component,
    CenterViewComponent,
    UniTradeComponent,
    SnackBarComponent,
    AllStatsDialogComponent,
    LoadingSpinnerComponent,
    IncomeDialogComponent,
    ProfitDialogComponent,
    GrainChartComponent,
    FarmBuybacksDialogComponent,
    HistoryPageComponent,
    MainComponentsComponent,
    StakedBoxComponent,
    TradeBoxComponent,
    HardWorkHistoryDialogComponent,
    TotalUsersDialogComponent,
    RewardsDialogComponent
  ],
  imports: [
    AppRoutingModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTabsModule,
    MatButtonModule,
    MatSidenavModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    MatSnackBarModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: environment.debugLevel,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false
    }),
    BrowserAnimationsModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    PerfectScrollbarModule,
    MatIconModule,
    AngularEmojisModule,
    SidebarModule.forRoot()
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
