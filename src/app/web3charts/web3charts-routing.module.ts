import {RouterModule, Routes} from '@angular/router';
import {Web3chartsComponent} from './web3charts.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: Web3chartsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Web3chartsRoutingModule {
}
