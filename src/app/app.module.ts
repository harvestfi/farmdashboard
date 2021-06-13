import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interceptorProviders} from './interceptors';
import {LayoutModule} from './main/layout/layout.module';
import {SidebarModule} from 'ng-sidebar';
import {SnackBarModule} from './main/snack-bar/snack-bar.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    LayoutModule,
    HttpClientModule,
    SnackBarModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'placeholder values - these are set at runtime using log.updateConfig()',
      level: 0,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false
    }),
    MatProgressBarModule,
    SidebarModule,
  ],
  providers: [
    interceptorProviders
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
