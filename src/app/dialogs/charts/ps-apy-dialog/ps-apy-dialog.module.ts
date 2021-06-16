import {NgModule} from '@angular/core';

import {PsApyDialogComponent} from './ps-apy-dialog.component';
import {ChartGeneralModule} from '../../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    PsApyDialogComponent,
  ],
  declarations: [
    PsApyDialogComponent,
  ],
  providers: [],
})
export class PsApyDialogModule {
}
