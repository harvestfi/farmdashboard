import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {StrategyListComponent} from './strategy-list.component';
import {PLATFORM_LIST, platforms} from './strategy-list.constants';

import {PopoverModule} from '@shared/popover/popover.module';
import {StrategyListFilterPipe} from './strategy-list.pipe';
import {IconsModule} from '@shared/icons/icons.module';
import {PipesModule} from '@shared/pipes/pipes.module';
import {DraggableModalModule} from '@modules/dialogs/draggable-modal/draggable-modal.module';
import {ApyWindowModule} from '../apy-window/apy-window.module';
import {CustomModalModule} from '@shared/custom-modal/custom-modal.module';
import {VaultTvlDialogModule} from '@modules/dialogs/charts/vault-tvl-dialog/vault-tvl-dialog.module';
import {SideMenuToggleModule} from '@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module';
import {ThemeSwitchModule} from '@layout/theme-switch/theme-switch.module';

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
    VaultTvlDialogModule,
    SideMenuToggleModule,
    ThemeSwitchModule,
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
