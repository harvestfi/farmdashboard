import {NgModule} from '@angular/core';

import {GasDialogComponent} from './gas-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    GasDialogComponent,
  ],
  declarations: [
    GasDialogComponent,
  ],
  providers: [],
})
export class GasDialogModule {
}
