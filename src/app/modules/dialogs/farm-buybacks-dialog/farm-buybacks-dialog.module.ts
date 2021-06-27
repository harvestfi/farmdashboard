import {NgModule} from '@angular/core';

import {FarmBuybacksDialogComponent} from './farm-buybacks-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule,
  ],
  exports: [
    FarmBuybacksDialogComponent,
  ],
  declarations: [
    FarmBuybacksDialogComponent,
  ],
  providers: [],
})
export class FarmBuybacksDialogModule {
}
