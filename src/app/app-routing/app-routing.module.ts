import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HistoryPageComponent} from '../history/history-page/history-page.component';
import {MainComponentsComponent} from '../main/main-components/main-components.component';
import { MainPageLightComponent } from '../main/main-page-light/main-page-light.component';
import { MainPageScoreboardComponent } from '../main/main-page-scoreboard/main-page-scoreboard.component';
import {UserSettings} from '../user-settings';


const isDarkMode = UserSettings.getTheme() == "scoreboard" ;
const routes: Routes = [
  {path: '', component: isDarkMode ? MainPageScoreboardComponent : MainPageLightComponent},
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
