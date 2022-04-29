import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page.component';
import { PsApyHistoryComponent } from '../dashboard/ps-apy-history/ps-apy-history.component';
import { WeeklyProfitHistoryComponent } from '../dashboard/weekly-profit-history/weekly-profit-history.component';
import { FarmBuybacksComponent } from '../dashboard/farm-buybacks/farm-buybacks.component';
import { SavedGasFeesComponent } from '../dashboard/saved-gas-fees/saved-gas-fees.component';
import { RewardsHistoryComponent } from '../dashboard/rewards-history/rewards-history.component';
import {
  DownloadHistoricDataComponent,
} from '../dashboard/download-historic-data/download-historic-data.component';
import { UserBalancesComponent } from '../dashboard/user-balances/user-balances.component';
import { VaultStatsTotalComponent } from '../dashboard/vault-stats-total/vault-stats-total.component';
import { StrategyListComponent } from '../dashboard/strategy-list/strategy-list.component';
import { VaultStatsComponent } from '../dashboard/vault-stats/vault-stats.component';
import { ROUTES } from '../../constants/routes.constant';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: ROUTES.CHARTS_PS_APY_HISTORY,
    component: PsApyHistoryComponent,
  },
  {
    path: ROUTES.CHARTS_WEEKLY_PROFIT_HISTORY,
    component: WeeklyProfitHistoryComponent,
  },
  {
    path: ROUTES.CHARTS_FARM_BUYBACKS,
    component: FarmBuybacksComponent,
  },
  {
    path: ROUTES.CHARTS_SAVED_GAS_FEES,
    component: SavedGasFeesComponent,
  },
  {
    path: ROUTES.CHARTS_INFO_TOTAL,
    component: VaultStatsTotalComponent,
  },
  {
    path: `${ROUTES.INFO}/:network/:address`,
    component: VaultStatsComponent,
  },
  {
    path: ROUTES.REWARDS_HISTORY,
    component: RewardsHistoryComponent,
  },
  {
    path: ROUTES.DOWNLOADS,
    component: DownloadHistoricDataComponent,
  },
  {
    path: ROUTES.USER_BALANCES,
    component: UserBalancesComponent,
  },
  {
    path: ROUTES.VAULTS_LIST,
    component: StrategyListComponent,
  },
  {
    path: ROUTES.USER_STATS,
    loadChildren: () => import('@modules/address-history/page-user-stats/page-user-stats.module')
      .then(m => m.PageUserStatsModule),
  },
  {
    path: ROUTES.PROFIT,
    loadChildren: () => import('@modules/address-history/profit/profit.module')
        .then(m => m.ProfitModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {
}
