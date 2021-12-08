import {AfterContentInit, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {WebsocketService} from '@data/services/websocket.service';
import {APP_CONFIG, AppConfig} from '../app.config';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {StaticValues} from '@data/static/static-values';
import {ApplicationErrorDialogComponent} from '@layout/application-error-dialog/application-error-dialog.component';
import {ViewTypeService} from '@data/services/view-type.service';
import {MatDialog} from '@angular/material/dialog';
import {BusyNotifierService} from '@data/services/busy-notifier.service';
import { DestroyService } from '@data/services/destroy.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DestroyService],
})
export class AppComponent implements AfterContentInit {
  buffering = true;
  private errored = false;

  constructor(
    public ws: WebsocketService,
    @Inject(APP_CONFIG) public config: AppConfig,
    public vt: ViewTypeService,
    public dialog: MatDialog,
    private loadingService: BusyNotifierService,
    private cdref: ChangeDetectorRef,
    private log: NGXLogger,
    private destroy$: DestroyService,
  ) {
    this.connectWebsocket();
    this.updateLogger();
  }

  connectWebsocket(): void {
    if (this.config.multipleSources) {
      const subs = new Set<string>();
      for (const network of StaticValues.NETWORKS.values()) {
        if (subs.has(network.ethparserName)) {
          continue;
        }
        this.ws.connectSockJs(network);
        subs.add(network.ethparserName);
      }
    } else {
      this.ws.connectSockJs(StaticValues.NETWORKS.get(this.config.defaultNetwork));
    }
  }

  updateLogger(): void {
    this.log.updateConfig({
      // serverLoggingUrl: config.apiEndpoint + '/api/logs',
      level: this.config.debugLevel,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false,
    });
  }

  ngAfterContentInit(): void {
    this.loadingService.busy
      .pipe(takeUntil(this.destroy$))
      .subscribe(buffering => {
        this.buffering = buffering;
        this.cdref.detectChanges();
      });

    this.loadingService.failures
      .pipe(
        filter(err => !this.errored && err instanceof Error),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.errored = true;
        this.dialog.open(ApplicationErrorDialogComponent);
      });
  }
}
