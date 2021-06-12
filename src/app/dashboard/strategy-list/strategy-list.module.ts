import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {StrategyListComponent} from './strategy-list.component';
import {PLATFORM_LIST, platforms} from './strategy-list.constants';

import {PopoverModule} from '../../common/popover/popover.module';
import {StrategyListFilterPipe} from './strategy-list.pipe';
import {IconsModule} from '../../static/components/icons/icons.module';
import {PipesModule} from '../../common/pipes/pipes.module';
import {DraggableModalModule} from '../../dialogs/draggable-modal/draggable-modal.module';
import {ApyWindowModule} from '../apy-window/apy-window.module';
import {CustomModalModule} from '../../dialogs/custom-modal/custom-modal.module';
import {VaultTvlDialogModule} from '../../dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PopoverModule,
    IconsModule,
    PipesModule,
    DraggableModalModule,
    ApyWindowModule,
    CustomModalModule,
    VaultTvlDialogModule
  ],
  exports: [
    StrategyListComponent,
  ],
  declarations: [
    StrategyListComponent,
    StrategyListFilterPipe,
  ],
  providers: [
    {provide: PLATFORM_LIST, useValue: platforms},
  ],
})
export class StrategyListModule {
}
