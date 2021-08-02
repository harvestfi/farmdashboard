import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPageComponent} from './main-page.component';
import {VaultStatsComponent} from '../dashboard/vault-stats/vault-stats.component';
import {VaultStatsTotalComponent} from '@modules/dashboard/vault-stats-total/vault-stats-total.component';


const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'info/:network/:address',
    component: VaultStatsComponent
  },
  {
    path: 'info-total',
    component: VaultStatsTotalComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {
}
