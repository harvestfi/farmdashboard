import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PageUserStatsRouting} from './page-user-stats.routing';
import { UserStatsComponent } from './components/user-stats.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SideMenuToggleModule } from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';
import { ThemeSwitchModule } from '@layout/theme-switch/theme-switch.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    PageUserStatsRouting,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressBarModule,
    SideMenuToggleModule,
    ThemeSwitchModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [
    UserStatsComponent,
  ],
  declarations: [
    UserStatsComponent,
  ],
})
export class PageUserStatsModule {
}
