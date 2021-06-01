import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Client, Message, over, StompSubscription} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {filter, first, switchMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {WsConsumer} from './ws-consumer';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {Network} from '../models/network';
import {NGXLogger} from 'ngx-logger';
import {StaticValues} from '../static/static-values';
import get = Reflect.get;

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private clients = new Map<string, Client>();
  private state: BehaviorSubject<SocketClientState>
      = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
  private recTimeout = null;
  private consumers = new Set<WsConsumer>();
  private subscriptions = new Set<string>();
  private wasConnected = new Map<string, boolean>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, false])
  );

  constructor(@Inject(APP_CONFIG) public config: AppConfig,
              private log: NGXLogger) {
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
  }

  public connectSockJs(network: Network): void {
    const url = get(this.config.wsEndpoints, network.ethparserName);
    const client = over(new SockJS(url));
    this.clients.set(network.ethparserName, client);
    client.debug = null;
    client.reconnect_delay = this.config.wsReconnectInterval * 1000;
    client.connect({}, () => {
      this.log.info('WebSocket connected ' + network.ethparserName, url);
      clearTimeout(this.recTimeout);
      // reload page not so elegant method, but it should work
      // without connection we have a gap for the data
      // - so when we have reconnect we reload the page
      if (this.wasConnected.get(network.ethparserName)) {
        const delay = (Math.random() * 120000) + 10000;
        this.log.warn('WS ' + network.ethparserName
            + 'reconnected! For avoiding a data gap the page will be reloaded in ' + delay);
        // for avoid DDOS on the backend
        setTimeout(() => {
          window.location.reload();
        }, delay);
      }
      this.wasConnected.set(network.ethparserName, true);
      if (Array.from(this.wasConnected.values()).filter(c => !c).length === 0) {
        this.log.info('All WebSocket connections established');
        this.subscriptions.clear();
        this.state.next(SocketClientState.CONNECTED);
        this.consumers.forEach(c => {
          if (!c.isSubscribed()) {
            c.subscribeToTopic();
          }
        });
      }
    }, (e) => {
      this.log.error('WebSocket error ' + network.ethparserName, e);
      this.consumers.forEach(c => c.setSubscribed(false));
      this.recTimeout = setTimeout(() => {
        this.connectSockJs(network);
      }, this.config.wsReconnectInterval * 1000);
    });
  }

  registerConsumer(wsConsumer: WsConsumer): boolean {
    if (this.consumers.has(wsConsumer)) {
      return false;
    }
    this.consumers.add(wsConsumer);
    return true;
  }

  onMessage(topic: string, handler = WebsocketService.jsonHandler): Observable<any> {
    if (this.subscriptions.has(topic)) {
      return;
    }
    this.subscriptions.add(topic);
    return this.connect().pipe(
        first(),
        switchMap(client =>
            new Observable<any>(observer => {
              client.unsubscribe(topic);
              const subscription: StompSubscription = client.subscribe(topic, message => {
                observer.next(handler(message));
              });
              return () => client.unsubscribe(subscription.id);
            })
        ));
  }

  // send(topic: string, payload: any): void {
  //   this.connect()
  //   .pipe(first())
  //   .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  // }

  public isNetworkConnected(network: string): boolean {
    if (this.clients.has(network)) {
      return this.clients.get(network).connected;
    }
    throw new Error(
        `isNetworkConnected() expected a valid network but received '${network}' 
      instead. Please make sure that '${network}' is part of the clients map`
    );
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(
          filter(state => state === SocketClientState.CONNECTED)
      ).subscribe(() =>
          Array.from(this.clients.values()).forEach(client => observer.next(client)));
    });
  }

}
