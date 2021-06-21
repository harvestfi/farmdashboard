import {NgModule} from '@angular/core';

import {FlowCardsViewComponent} from './flow-cards-view.component';
import {HardworkFlowCardModule} from '../hardwork/hardwork-flow-card.module';
import {UniswapFlowCardModule} from '../uniswap/uniswap-flow-card.module';
import {HarvestFlowCardModule} from '../harvest/harvest-flow-card.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HardworkFlowCardModule,
    UniswapFlowCardModule,
    HarvestFlowCardModule,
  ],
  exports: [
    FlowCardsViewComponent,
  ],
  declarations: [
    FlowCardsViewComponent,
  ],
  providers: [],
})
export class FlowCardsViewModule {
}
