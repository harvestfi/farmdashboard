import {NgModule} from '@angular/core';

import {IconsComponent} from './icons.component';
import {CommonModule} from '@angular/common';
import {VaultIconsPipe} from '@shared/icons/vault-icons.pipe';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    IconsComponent,
  ],
  declarations: [
    IconsComponent,
    VaultIconsPipe
  ],
  providers: [],
})
export class IconsModule {
}
