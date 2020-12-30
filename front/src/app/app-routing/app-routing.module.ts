import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HistoryPageComponent} from "../history/history-page/history-page.component";
import {MainComponentsComponent} from "../main/main-components/main-components.component";

const routes: Routes = [
  {path: '', component: MainComponentsComponent},
  {path: 'history/:address', component: HistoryPageComponent},
  {path: 'history', component: HistoryPageComponent},

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
