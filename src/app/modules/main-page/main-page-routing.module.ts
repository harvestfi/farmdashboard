import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPageComponent} from './main-page.component';
import {PsApyHistoryComponent} from '@modules/dashboard/ps-apy-history/ps-apy-history.component';
import {WeeklyProfitHistoryComponent} from '@modules/dashboard/weekly-profit-history/weekly-profit-history.component';
import {FarmBuybacksComponent} from '@modules/dashboard/farm-buybacks/farm-buybacks.component';
import {SavedGasFeesComponent} from '@modules/dashboard/saved-gas-fees/saved-gas-fees.component';
import {RewardsHistoryComponent} from '@modules/dashboard/rewards-history/rewards-history.component';
import {DownloadHistoricDataComponent} from '@modules/dashboard/download-historic-data/download-historic-data.component';
import {UserBalancesComponent} from '@modules/dashboard/user-balances/user-balances.component';
import {VaultStatsTotalComponent} from '@modules/dashboard/vault-stats-total/vault-stats-total.component';
import {StrategyListComponent} from '@modules/dashboard/strategy-list/strategy-list.component';
import {VaultStatsComponent} from '@modules/dashboard/vault-stats/vault-stats.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'charts/ps-apy-history',
    component: PsApyHistoryComponent,
  },
  {
    path: 'charts/weekly-profit-history',
    component: WeeklyProfitHistoryComponent,
  },
  {
    path: 'charts/farm-buybacks',
    component: FarmBuybacksComponent,
  },
  {
    path: 'charts/saved-gas-fees',
    component: SavedGasFeesComponent,
  },
  {
    path: 'charts/info-total',
    component: VaultStatsTotalComponent
  },
  {
    path: 'rewards-history',
    component: RewardsHistoryComponent,
  },
  {
     path: 'downloads',
     component: DownloadHistoricDataComponent,
  },
  {
     path: 'user-balances',
     component: UserBalancesComponent,
  },
  {
     path: 'vaults-list',
     component: StrategyListComponent,
  },
  {
     path: 'info/:network/:address',
     component: VaultStatsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {
}
