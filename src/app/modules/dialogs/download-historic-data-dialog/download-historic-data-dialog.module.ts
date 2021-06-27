import {NgModule} from '@angular/core';

import {DownloadHistoricDataDialogComponent} from './download-historic-data-dialog.component';
import {IconsModule} from '@shared/icons/icons.module';
import {CommonModule} from '@angular/common';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  imports: [
    IconsModule,
    CommonModule,
    MatSortModule,
    MatDialogModule,
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
