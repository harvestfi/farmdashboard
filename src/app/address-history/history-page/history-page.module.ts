import {NgModule} from '@angular/core';

import {HistoryPageComponent} from './history-page.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {SimpleChartDialogModule} from '../../dialogs/charts/simple-chart-dialog/simple-chart-dialog.module';
import {IconsModule} from '../../static/components/icons/icons.module';
import {TradeBoxModule} from '../trade-box/trade-box.module';
import {LoadingSpinnerModule} from '../../main/loading-spinner/loading-spinner.module';
import {MatButtonModule} from '@angular/material/button';
import {HistoryPageRoutingModule} from './history-page-routing.module';

@NgModule({
  imports: [
    HistoryPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
    MatCheckboxModule,
    CustomModalModule,
    SimpleChartDialogModule,
    IconsModule,
    TradeBoxModule,
    LoadingSpinnerModule,
    MatButtonModule,
  ],
  exports: [
    HistoryPageComponent,
  ],
  declarations: [
    HistoryPageComponent,
  ],
  providers: [],
})
export class HistoryPageModule {
}
