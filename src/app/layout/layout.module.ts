import {NgModule} from '@angular/core';
import {MainFooterComponent} from './main-footer/main-footer.component';
import {MainSideMenuComponent} from './main-side-menu/main-side-menu.component';
import {ApplicationErrorDialogComponent} from './application-error-dialog/application-error-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {CollapsibleAreaComponent} from './main-side-menu/collapsable-area/collapsible-area.component';
import {MainTopNavigationComponent} from './main-top-navigation/main-top-navigation.component';
import {CommonModule} from '@angular/common';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {PsApyDialogModule} from '@modules/dialogs/charts/ps-apy-dialog/ps-apy-dialog.module';
import {WeeklyProfitDialogModule} from '@modules/dialogs/weekly-profit-dialog/weekly-profit-dialog.module';
import {FarmBuybacksDialogModule} from '@modules/dialogs/farm-buybacks-dialog/farm-buybacks-dialog.module';
import {SavedGasFeesDialogModule} from '@modules/dialogs/saved-gas-fees-dialog/saved-gas-fees-dialog.module';
import {RewardsHistoryDialogModule} from '@modules/dialogs/history/rewards-history-dialog/rewards-history-dialog.module';
import {DownloadHistoricDataDialogModule} from '@modules/dialogs/download-historic-data-dialog/download-historic-data-dialog.module';
import {UserBalancesDialogModule} from '@modules/dialogs/user-balances-dialog/user-balances-dialog.module';
import {PopoverModule} from '@shared/popover/popover.module';
import {PsApyHistoryModule} from '@modules/dashboard/ps-apy-history/ps-apy-history.module';
import {WeeklyProfitHistoryModule} from '@modules/dashboard/weekly-profit-history/weekly-profit-history.module';
import {FarmBuybacksModule} from '@modules/dashboard/farm-buybacks/farm-butbacks.module';
import {SavedGasFeesModule} from '@modules/dashboard/saved-gas-fees/saved-gas-fees.module';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {RewardsHistoryModule} from '@modules/dashboard/rewards-history/rewards-history.module';
import {DownloadsHistoricDataModule} from '@modules/dashboard/download-historic-data/downloads-historic-data.module';
import {UserBalancesModule} from '@modules/dashboard/user-balances/user-balances.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    CustomModalModule,
    PsApyDialogModule,
    WeeklyProfitDialogModule,
    FarmBuybacksDialogModule,
    SavedGasFeesDialogModule,
    RewardsHistoryDialogModule,
    DownloadHistoricDataDialogModule,
    DownloadsHistoricDataModule,
    UserBalancesDialogModule,
    PopoverModule,
    PsApyHistoryModule,
    WeeklyProfitHistoryModule,
    FarmBuybacksModule,
    SavedGasFeesModule,
    RewardsHistoryModule,
    ThemeSwitchModule,
    UserBalancesModule,
    SideMenuToggleModule,
    RouterModule,
  ],
  exports: [
    MainTopNavigationComponent,
    MainFooterComponent,
    MainSideMenuComponent,
    CollapsibleAreaComponent,
    ApplicationErrorDialogComponent,
  ],
  declarations: [
    MainTopNavigationComponent,
    MainFooterComponent,
    MainSideMenuComponent,
    CollapsibleAreaComponent,
    ApplicationErrorDialogComponent,
  ],
  providers: [],
})
export class LayoutModule {
}
