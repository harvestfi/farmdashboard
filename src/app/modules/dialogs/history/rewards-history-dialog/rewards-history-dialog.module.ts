import {NgModule} from '@angular/core';

import {RewardsHistoryDialogComponent} from './rewards-history-dialog.component';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerModule} from '@shared/loading-spinner/loading-spinner.module';
import {FormsModule} from '@angular/forms';
import {IconsModule} from '@shared/icons/icons.module';
import {MatIconModule} from '@angular/material/icon';
import {PaginatorModule} from '@shared/paginator/paginator.module';

@NgModule({
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    FormsModule,
    IconsModule,
    MatIconModule,
    PaginatorModule
  ],
  exports: [
    RewardsHistoryDialogComponent,
  ],
  declarations: [
    RewardsHistoryDialogComponent,
  ],
  providers: [],
})
export class RewardsHistoryDialogModule {
}
