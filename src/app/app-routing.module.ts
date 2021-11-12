import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/main-page/main-page.module').then(m => m.MainPageModule),
  },
  {
    path: 'history',
    loadChildren: () => import('./modules/address-history/history-page/history-page.module').then(m => m.HistoryPageModule),
  },
  {
    path: 'charts',
    loadChildren: () => import('./modules/web3charts/web3charts.module').then(m => m.Web3ChartsModule),
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
