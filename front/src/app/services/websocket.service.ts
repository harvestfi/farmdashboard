import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Client, Message, over, StompSubscription} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';
import {filter, first, switchMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {WsConsumer} from './ws-consumer';

export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.wsReconnectInterval;

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private client: Client;
  private state: BehaviorSubject<SocketClientState>
      = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
  private recTimeout = null;
  private consumers = new Set<WsConsumer>();
  private subscriptions = new Set<string>();

  constructor() {
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
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
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        inst.unsubscribe(topic);
        const subscription: StompSubscription = inst.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  send(topic: string, payload: any): void {
    this.connect()
    .pipe(first())
    .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  }

  public connectSockJs(): void {
    this.client = over(new SockJS(WS_ENDPOINT));
    this.client.debug = null;
    this.client.reconnect_delay = RECONNECT_INTERVAL * 1000;
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
      clearTimeout(this.recTimeout);
      this.consumers.forEach(c => {
        if (!c.isSubscribed()) {
          c.subscribeToTopic();
        }
      });
    }, () => {
      this.consumers.forEach(c => c.setSubscribed(false));
      this.recTimeout = setTimeout(() => {
        this.connectSockJs();
      }, RECONNECT_INTERVAL * 1000);
    });
  }

  public isConnected(): boolean {
    if (this.client) {
      return this.client?.connected;
    }
    return false;
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

}
