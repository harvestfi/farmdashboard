import {NgModule} from '@angular/core';
import {interceptorProviders} from './interceptors';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    interceptorProviders,
  ],
})
export class CoreModule {
}
