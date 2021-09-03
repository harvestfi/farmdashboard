import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsModule} from '@shared/icons/icons.module';
import {DownloadHistoricDataComponent} from '@modules/dashboard/download-historic-data/download-historic-data.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [
      IconsModule,
      CommonModule,
      MatSortModule,
      MatDialogModule,
  ],
  exports: [
    DownloadHistoricDataComponent
  ],
  declarations: [
    DownloadHistoricDataComponent,
  ],
  providers: [],
})
export class DownloadsHistoricDataModule {
}
