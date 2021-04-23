import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Client, Message, over, StompSubscription} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {filter, first, switchMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {WsConsumer} from './ws-consumer';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {Network} from '../models/network';
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
  private wasConnected = false;

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
  }

  public connectSockJs(network: Network): void {
    const client = over(new SockJS(get(this.config.wsEndpoints, network.ethparserName)));
    this.clients.set(network.ethparserName, client);
    client.debug = null;
    client.reconnect_delay = this.config.wsReconnectInterval * 1000;
    client.connect({}, () => {
      clearTimeout(this.recTimeout);
      // reload page not so elegant method, but it should work
      // without connection we have a gap for the data, we should reload
      if (this.wasConnected) {
        // for avoid DDOS on the backend
        setTimeout(() => {
          window.location.reload();
        }, (Math.random() * 120000) + 10000);
      }
      this.subscriptions.clear();
      this.state.next(SocketClientState.CONNECTED);
      this.consumers.forEach(c => {
        if (!c.isSubscribed()) {
          c.subscribeToTopic();
        }
      });
      this.wasConnected = true;
    }, () => {
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
        // first(),
        switchMap(inst =>
            new Observable<any>(observer => {
              inst.unsubscribe(topic);
              const subscription: StompSubscription = inst.subscribe(topic, message => {
                observer.next(handler(message));
              });
              return () => inst.unsubscribe(subscription.id);
            })
        ));
  }

  // send(topic: string, payload: any): void {
  //   this.connect()
  //   .pipe(first())
  //   .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  // }

  // TODO split
  public isConnected(): boolean {
    return Array.from(this.clients.values())
    .map(c => c.connected)
    .filter(c => !c)
        .length === 0;
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
