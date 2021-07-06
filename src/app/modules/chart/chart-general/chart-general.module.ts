import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ChartGeneralComponent} from './chart-general.component';
import {LoadingSpinnerModule} from '@shared/loading-spinner/loading-spinner.module';


@NgModule({
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    FormsModule,
  ],
  exports: [
    ChartGeneralComponent,
  ],
  declarations: [
    ChartGeneralComponent,
  ],
  providers: [],
})
export class ChartGeneralModule {
}
