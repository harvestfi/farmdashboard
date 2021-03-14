import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HistoryPageComponent} from '../history/history-page/history-page.component';
import {CenterViewComponent} from '../main/center-view/center-view.component';
import {StatisticBoardPageComponent} from '../statistic-board/statistic-board-page/statistic-board-page.component';

const routes: Routes = [
  {path: '', component: CenterViewComponent},
  {path: 'history/:address', component: HistoryPageComponent},
  {path: 'history', component: HistoryPageComponent},
  {path: 'statistic-boards', component: StatisticBoardPageComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
