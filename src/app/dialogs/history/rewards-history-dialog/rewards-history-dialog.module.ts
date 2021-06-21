import {NgModule} from '@angular/core';

import {RewardsHistoryDialogComponent} from './rewards-history-dialog.component';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerModule} from '../../../main/loading-spinner/loading-spinner.module';
import {FormsModule} from '@angular/forms';
import {IconsModule} from '../../../static/components/icons/icons.module';
import {MatIconModule} from '@angular/material/icon';
import {PaginatorModule} from '../../../common/paginator/paginator.module';

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
