import {NgModule} from '@angular/core';

import {TvlV2DialogComponent} from './tvl-v2-dialog.component';
import {ChartGeneralModule} from '../../chart/chart-general/chart-general.module';

@NgModule({
  imports: [
    ChartGeneralModule
  ],
  exports: [
    TvlV2DialogComponent,
  ],
  declarations: [
    TvlV2DialogComponent,
  ],
  providers: [],
})
export class TvlV2DialogModule {
}
