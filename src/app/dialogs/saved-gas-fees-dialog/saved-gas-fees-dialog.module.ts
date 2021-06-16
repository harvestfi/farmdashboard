import {NgModule} from '@angular/core';

import {SavedGasFeesDialogComponent} from './saved-gas-fees-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    SavedGasFeesDialogComponent,
  ],
  declarations: [
    SavedGasFeesDialogComponent,
  ],
  providers: [],
})
export class SavedGasFeesDialogModule {
}
