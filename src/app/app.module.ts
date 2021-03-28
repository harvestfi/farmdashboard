import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';
import { FarmChartComponent } from './chart/farm-chart/farm-chart.component';
import { UniTxComponent } from './flow-cards/uniswap/uni-tx/uni-tx.component';
import { MatCardModule } from '@angular/material/card';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlowTabComponent } from './flow-cards/uniswap/flow-tab/flow-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { HarvestTxComponent } from './flow-cards/harvest/harvest-tx/harvest-tx.component';
import { HarvestFlowTabComponent } from './flow-cards/harvest/harvest-flow-tab/harvest-flow-tab.component';
import { AngularEmojisModule } from 'angular-emojis';
import { HarvestFilterPipe } from './flow-cards/harvest/harvest-filter.pipe';
import { UniswapFilterPipe } from './flow-cards/uniswap/uniswap-filter.pipe';
import { DashboardLastValuesComponent } from './dashboard/dashboard-last-values/dashboard-last-values.component';
import { TvlBoxComponent } from './dashboard/tvl-box/tvl-box.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { TvlDialogComponent } from './dialogs/tvl-dialog/tvl-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MainPageScoreboardComponent } from './main/main-page-scoreboard/main-page-scoreboard.component';
import { MainPageViewComponent } from './main/main-page-view/main-page-view.component';
import { StrategyListComponent } from './dashboard/strategy-list/strategy-list.component';
import { MainFooterComponent } from './main/main-footer/main-footer.component';
import { CommonModule } from '@angular/common';
import { MainPageLightComponent } from './main/main-page-light/main-page-light.component';
import { CenterViewComponent } from './main/center-view/center-view.component';
import { UniTradeComponent } from './flow-cards/uniswap/uni-trade/uni-trade.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarModule } from 'ng-sidebar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { SnackBarComponent } from './main/snack-bar/snack-bar.component';
import { AllStatsDialogComponent } from './dialogs/all-stats-dialog/all-stats-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { LoadingSpinnerComponent } from './main/loading-spinner/loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IncomeDialogComponent } from './dialogs/income-dialog/income-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../environments/environment';
import { ProfitDialogComponent } from './dialogs/profit-dialog/profit-dialog.component';
import { GrainChartComponent } from './chart/grain-chart/grain-chart.component';
import { FarmBuybacksDialogComponent } from './dialogs/farm-buybacks-dialog/farm-buybacks-dialog.component';
import { HistoryPageComponent } from './history/history-page/history-page.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { TradeBoxComponent } from './history/trade-box/trade-box.component';
import { HardWorkHistoryDialogComponent } from './dialogs/hard-work-history-dialog/hard-work-history-dialog.component';
import { TotalUsersDialogComponent } from './dialogs/total-users-dialog/total-users-dialog.component';
import { RewardsDialogComponent } from './dialogs/rewards-dialog/rewards-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { HarvestHistoryDialogComponent } from './dialogs/harvest-history-dialog/harvest-history-dialog.component';
import { SimpleChartDialogComponent } from './dialogs/simple-chart-dialog/simple-chart-dialog.component';
import { UniHistoryDialogComponent } from './dialogs/uni-history-dialog/uni-history-dialog.component';
import { PriceChartComponent } from './chart/price-chart/price-chart.component';
import { DraggableModalComponent } from './dialogs/draggable-modal/draggable-modal.component';
import { CustomModalComponent } from './dialogs/custom-modal/custom-modal.component';
import { HarvestTradeComponent } from './flow-cards/harvest/harvest-trade/harvest-trade.component';
import { LinkWindowComponent } from './flow-cards/uniswap/link-window/link-window.component';
import { ApyWindowComponent } from './dashboard/apy-window/apy-window.component';
import { HardWorkHistoryListDialogComponent } from './dialogs/hard-work-history-list-dialog/hard-work-history-list-dialog.component';
import { HardworkTradeComponent } from './flow-cards/hardwork/hardwork-trade/hardwork-trade.component';
import { HardworkFlowTabComponent } from './flow-cards/hardwork/hardwork-flow-tab/hardwork-flow-tab.component';
import { HardworkTxComponent } from './flow-cards/hardwork/hardwork-tx/hardwork-tx.component';
import { HardworkHeaderComponent } from './flow-cards/hardwork/hardwork-header/hardwork-header.component';
import { HardworkFilterPipe } from './flow-cards/hardwork/hardwork-filter.pipe';
import { MainSideMenuComponent } from './main/main-side-menu/main-side-menu.component';
import { SimpleModalComponent } from './dialogs/simple-modal/simple-modal.component';
import { FlowCardsViewComponent } from './flow-cards/flow-cards-view/flow-cards-view.component';
import { LastPricesListComponent } from './dashboard/last-prices-list/last-prices-list.component';
import { UserBalancesDialogComponent } from './dialogs/user-balances-dialog/user-balances-dialog.component';
import { DownloadHistoricDataDialogComponent } from './dialogs/download-historic-data-dialog/download-historic-data-dialog.component';

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
    MainPageScoreboardComponent,
    MainPageViewComponent,
    StrategyListComponent,
    MainFooterComponent,
    MainPageLightComponent,
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
    TradeBoxComponent,
    HardWorkHistoryDialogComponent,
    TotalUsersDialogComponent,
    UniHistoryDialogComponent,
    RewardsDialogComponent,
    HarvestHistoryDialogComponent,
    SimpleChartDialogComponent,
    PriceChartComponent,
    DraggableModalComponent,
    CustomModalComponent,
    HarvestTradeComponent,
    LinkWindowComponent,
    ApyWindowComponent,
    HardWorkHistoryListDialogComponent,
    HardworkTradeComponent,
    HardworkFlowTabComponent,
    HardworkTxComponent,
    HardworkHeaderComponent,
    HardworkFilterPipe,
    MainSideMenuComponent,
    SimpleModalComponent,
    FlowCardsViewComponent,
    LastPricesListComponent,
    UserBalancesDialogComponent,
    DownloadHistoricDataDialogComponent,
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
    MatInputModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    MatSnackBarModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: environment.apiEndpoint + '/api/logs',
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
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
  },
],
  bootstrap: [AppComponent],
})
export class AppModule {
}
