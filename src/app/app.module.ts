import { BrowserModule } from '@angular/platform-browser';
import { Inject, NgModule } from '@angular/core';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MainPageViewComponent } from './main/main-page-view/main-page-view.component';
import { StrategyListComponent } from './dashboard/strategy-list/strategy-list.component';
import { MainFooterComponent } from './main/main-footer/main-footer.component';
import { CommonModule } from '@angular/common';
import {MainPageLightComponent} from './main/main-page-light/main-page-light.component';
import { CenterViewComponent } from './main/center-view/center-view.component';
import { UniTradeComponent } from './flow-cards/uniswap/uni-trade/uni-trade.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarModule } from 'ng-sidebar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { SnackBarComponent } from './main/snack-bar/snack-bar.component';
import { MatSortModule } from '@angular/material/sort';
import { LoadingSpinnerComponent } from './main/loading-spinner/loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApyChartDialogComponent } from './dialogs/charts/apy-chart-dialog/apy-chart-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../environments/environment';
import { WeeklyProfitDialogComponent } from './dialogs/charts/weekly-profit-dialog/weekly-profit-dialog.component';
import { GrainChartComponent } from './chart/grain-chart/grain-chart.component';
import { FarmBuybacksDialogComponent } from './dialogs/charts/farm-buybacks-dialog/farm-buybacks-dialog.component';
import { HistoryPageComponent } from './address-history/history-page/history-page.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { TradeBoxComponent } from './address-history/trade-box/trade-box.component';
import { SavedGasFeesDialogComponent } from './dialogs/charts/saved-gas-fees-dialog/saved-gas-fees-dialog.component';
import { TotalUsersDialogComponent } from './dialogs/charts/total-users-dialog/total-users-dialog.component';
import { PsApyDialogComponent } from './dialogs/charts/ps-apy-dialog/ps-apy-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { HarvestHistoryDialogComponent } from './dialogs/history/harvest-history-dialog/harvest-history-dialog.component';
import { SimpleChartDialogComponent } from './dialogs/charts/simple-chart-dialog/simple-chart-dialog.component';
import { UniHistoryDialogComponent } from './dialogs/history/uni-history-dialog/uni-history-dialog.component';
import { PriceChartComponent } from './chart/price-chart/price-chart.component';
import { DraggableModalComponent } from './dialogs/draggable-modal/draggable-modal.component';
import { CustomModalComponent } from './dialogs/custom-modal/custom-modal.component';
import { HarvestTradeComponent } from './flow-cards/harvest/harvest-trade/harvest-trade.component';
import { LinkWindowComponent } from './flow-cards/uniswap/link-window/link-window.component';
import { ApyWindowComponent } from './dashboard/apy-window/apy-window.component';
import { HardWorkHistoryListDialogComponent }
from './dialogs/history/hard-work-history-list-dialog/hard-work-history-list-dialog.component';
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
import { Web3chartsComponent } from './web3charts/web3charts.component';
import { Web3chartComponent } from './web3charts/components/web3chart/web3chart.component';
import { DownloadHistoricDataDialogComponent } from './dialogs/download-historic-data-dialog/download-historic-data-dialog.component';
import {RewardsHistoryDialogComponent} from './dialogs/history/rewards-history-dialog/rewards-history-dialog.component';
import {VaultFilterPipe} from './dialogs/history/rewards-history-dialog/vault-filter.pipe';
import {TransactionComponent} from './static/components/transactions/transaction.component';
import {IconsComponent} from './static/components/icons/icons.component';
import {GasDialogComponent} from './dialogs/charts/gas-dialog/gas-dialog.component';
import {PaginatorComponent} from './common/paginator/paginator.component';
import {StrategyListFilterPipe} from './dashboard/strategy-list/strategy-list.pipe';
import {SelectElementComponent} from './common/select-element/select-element.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TvlV2DialogComponent } from './dialogs/charts/tvl-v2-dialog/tvl-v2-dialog.component';
import { VaultTvlDialogComponent } from './dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.component';
import { ChartGeneralComponent } from './chart/chart-general/chart-general.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {PopoverComponent} from './common/popover/popover.component';
import {CollapsibleAreaComponent} from './main/collapsable-area/collapsible-area.component';
import {VaultComponent} from './dashboard/apy-window/vault.component';
import {StrategyComponent} from './dashboard/apy-window/strategy.component';
import {PoolComponent} from './dashboard/apy-window/pool.component';
import {AddressComponent} from './static/components/addresses/address.component';
import {MainTopNavigationComponent} from './main/main-top-navigation/main-top-navigation.component';
import {ApyCommonComponent} from './dashboard/apy-window/apy-common.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interceptorProviders} from './interceptors';
import {ApplicationErrorDialog} from './main/main-page-light/application-error-dialog';


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
    MainPageViewComponent,
    StrategyListComponent,
    MainFooterComponent,
    MainPageLightComponent,
    CenterViewComponent,
    UniTradeComponent,
    SnackBarComponent,
    LoadingSpinnerComponent,
    ApyChartDialogComponent,
    WeeklyProfitDialogComponent,
    GrainChartComponent,
    FarmBuybacksDialogComponent,
    HistoryPageComponent,
    TradeBoxComponent,
    SavedGasFeesDialogComponent,
    TotalUsersDialogComponent,
    UniHistoryDialogComponent,
    PsApyDialogComponent,
    RewardsHistoryDialogComponent,
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
    VaultFilterPipe,
    TransactionComponent,
    IconsComponent,
    Web3chartsComponent,
    Web3chartComponent,
    GasDialogComponent,
    PaginatorComponent,
    StrategyListFilterPipe,
    SelectElementComponent,
    TvlV2DialogComponent,
    VaultTvlDialogComponent,
    ChartGeneralComponent,
    PopoverComponent,
    CollapsibleAreaComponent,
    VaultComponent,
    StrategyComponent,
    PoolComponent,
    AddressComponent,
    ApyCommonComponent,
    MainTopNavigationComponent,
    ApplicationErrorDialog
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
    MatButtonToggleModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    MatSnackBarModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'placeholder values - these are set at runtime using log.updateConfig()',
      level: 0,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false
    }),
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    PerfectScrollbarModule,
    MatIconModule,
    AngularEmojisModule,
    SidebarModule.forRoot(),
    NgbModule,
    MatProgressBarModule,
  ],
  providers: [
  interceptorProviders
],
  bootstrap: [AppComponent],
})
export class AppModule {
}
