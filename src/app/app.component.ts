import {Component, Inject} from '@angular/core';
import {WebsocketService} from './services/websocket.service';
import {APP_CONFIG, AppConfig} from '../app.config';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'farmdashboard-front';

  constructor(
      public ws: WebsocketService,
      @Inject(APP_CONFIG) public config: AppConfig,
      private log: NGXLogger) {
    this.ws.connectSockJs();
    this.log.updateConfig({
      // serverLoggingUrl: config.apiEndpoint + '/api/logs',
      level: config.debugLevel,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false
    });
  }
}
