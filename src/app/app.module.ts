import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LayoutModule } from '@layout/layout.module';
import { SidebarModule } from 'ng-sidebar';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    LayoutModule,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
