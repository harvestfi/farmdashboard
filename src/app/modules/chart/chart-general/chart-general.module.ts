import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ChartGeneralComponent} from './chart-general.component';
import {LoadingSpinnerModule} from '@shared/loading-spinner/loading-spinner.module';
import {MatTabsModule} from '@angular/material/tabs';
import {NgxEchartsModule} from 'ngx-echarts';


@NgModule({
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    FormsModule,
    MatTabsModule,
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
    }),
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
