import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HistoryPageViewComponent} from '../history/history-page-view/history-page-view.component';
import {MainComponentsComponent} from '../main/main-components/main-components.component';

const routes: Routes = [
  {path: '', component: MainComponentsComponent},
  {path: 'history/:address', component: HistoryPageViewComponent},
  {path: 'history', component: HistoryPageViewComponent},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
