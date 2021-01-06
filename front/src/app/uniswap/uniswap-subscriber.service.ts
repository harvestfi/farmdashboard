import {Injectable} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';
import {UniswapDto} from '../models/uniswap-dto';
import {WsConsumer} from '../services/ws-consumer';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class UniswapSubscriberService implements WsConsumer {
  subscribed = false;
  public handlers = new Map<any, ((value: UniswapDto) => void)>();

  constructor(private ws: WebsocketService, private log: NGXLogger) {
    if (this.ws.registerConsumer(this) && !this.subscribed) {
      this.subscribeToTopic();
    }
  }

  public subscribeToUniswap(): void {
    this.log.info('Uniswap Subscribe on topic');
    this.subscribed = true;
    this.ws.onMessage('/topic/transactions', (m => UniswapDto.fromJson(m.body)))
    .subscribe(tx => {
      this.log.debug('uni tx', tx);
      try {
        this.handlers.forEach((handler, obj) => handler.call(obj, tx));
      } catch (e) {
        this.log.error('Error with uni tx', e);
      }
    });
  }

  setSubscribed(s: boolean): void {
    this.subscribed = s;
  }

  isSubscribed(): boolean {
    return this.subscribed;
  }


  subscribeToTopic(): void {
    this.subscribeToUniswap();
  }


}
