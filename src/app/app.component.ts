import {Component, Inject} from '@angular/core';
import {WebsocketService} from './services/websocket.service';
import {APP_CONFIG, AppConfig} from '../app.config';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {StaticValues} from './static/static-values';
import {Networks} from './static/networks';

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
    if (config.multipleSources) {
      const subs = new Set<string>();
      for (const network of StaticValues.NETWORKS.values()) {
        if (subs.has(network.ethparserName)) {
          continue;
        }
        this.ws.connectSockJs(network);
        subs.add(network.ethparserName);
      }
    } else {
      this.ws.connectSockJs(StaticValues.NETWORKS.get(config.defaultNetwork));
    }
    this.log.updateConfig({
      // serverLoggingUrl: config.apiEndpoint + '/api/logs',
      level: config.debugLevel,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false
    });
  }
}
