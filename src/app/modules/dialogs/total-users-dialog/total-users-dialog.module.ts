import {NgModule} from '@angular/core';

import {TotalUsersDialogComponent} from './total-users-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    ChartGeneralModule,
    CommonModule,
  ],
  exports: [
    TotalUsersDialogComponent,
  ],
  declarations: [
    TotalUsersDialogComponent,
  ],
  providers: [],
})
export class TotalUsersDialogModule {
}
