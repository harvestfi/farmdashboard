import {NgModule} from '@angular/core';

import {LoadingSpinnerComponent} from './loading-spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    LoadingSpinnerComponent,
  ],
  declarations: [
    LoadingSpinnerComponent,
  ],
  providers: [],
})
export class LoadingSpinnerModule {
}
