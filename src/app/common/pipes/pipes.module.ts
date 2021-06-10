import {NgModule} from '@angular/core';
import {DaysAgoPipe} from './days-ago.pipe';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [],
  exports: [
    DaysAgoPipe,
  ],
  declarations: [
    DaysAgoPipe,
  ],
  providers: [],
})
export class PipesModule {
}
