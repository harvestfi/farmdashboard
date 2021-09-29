import {NgModule} from '@angular/core';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';
import {RewardsHistoryComponent} from '@modules/dashboard/rewards-history/rewards-history.component';
import {PaginatorModule} from '@shared/paginator/paginator.module';
import {LoadingSpinnerModule} from '@shared/loading-spinner/loading-spinner.module';
import {CommonModule} from '@angular/common';
import {IconsModule} from '@shared/icons/icons.module';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';

@NgModule({
  imports: [
    ThemeSwitchModule,
    CommonModule,
    LoadingSpinnerModule,
    FormsModule,
    IconsModule,
    MatIconModule,
    PaginatorModule,
    SideMenuToggleModule,
  ],
  exports: [
    RewardsHistoryComponent,
  ],
  declarations: [
    RewardsHistoryComponent,
  ],
  providers: [],
})
export class RewardsHistoryModule {
}
