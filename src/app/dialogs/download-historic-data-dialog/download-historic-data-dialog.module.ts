import {NgModule} from '@angular/core';

import {DownloadHistoricDataDialogComponent} from './download-historic-data-dialog.component';
import {IconsModule} from '../../static/components/icons/icons.module';
import {CommonModule} from '@angular/common';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [
    IconsModule,
    CommonModule,
    MatSortModule,
  ],
  exports: [
    DownloadHistoricDataDialogComponent,
  ],
  declarations: [
    DownloadHistoricDataDialogComponent,
  ],
  providers: [],
})
export class DownloadHistoricDataDialogModule {
}
