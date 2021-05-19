import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HistoryPageComponent} from '../address-history/history-page/history-page.component';
import {CenterViewComponent} from '../main/center-view/center-view.component';
import {Web3chartsComponent} from '../web3charts/web3charts.component';

const routes: Routes = [
  {path: '', component: CenterViewComponent},
  {path: 'history/:address', component: HistoryPageComponent},
  {path: 'history', component: HistoryPageComponent},
  {path: 'charts', component: Web3chartsComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
