import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserStatsComponent} from './components/user-stats.component';

const routes: Routes = [
  {
    path: '',
    component: UserStatsComponent,
  },
  {
    path: ':address',
    component: UserStatsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageUserStatsRouting {
}
