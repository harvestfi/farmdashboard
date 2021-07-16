import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PaginatorModule} from './paginator/paginator.module';
import {PipesModule} from './pipes/pipes.module';
import {PopoverModule} from './popover/popover.module';

@NgModule({
  imports: [
    FormsModule,
    PaginatorModule,
    PipesModule,
    PopoverModule,
  ],
  exports: [
    FormsModule,
    PaginatorModule,
    PipesModule,
    PopoverModule,
  ],
  declarations: [],
  providers: [],
})
export class SharedModule {
}
