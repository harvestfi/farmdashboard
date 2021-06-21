import {NgModule} from '@angular/core';
import {DaysAgoPipe} from './days-ago.pipe';
import {VaultFilterPipe} from './vault-filter.pipe';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [],
  exports: [
    DaysAgoPipe,
    VaultFilterPipe,
  ],
  declarations: [
    DaysAgoPipe,
    VaultFilterPipe,
  ],
  providers: [],
})
export class PipesModule {
}
