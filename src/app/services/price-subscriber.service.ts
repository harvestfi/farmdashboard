import { Injectable } from '@angular/core';
import {WsConsumer} from './ws-consumer';
import {WebsocketService} from './websocket.service';
import {PricesCalculationService} from './prices-calculation.service';
import {SnackService} from './snack.service';
import {NGXLogger} from 'ngx-logger';
import {HardWorkDto} from '../models/hardwork-dto';
import {PricesDto} from '../models/prices-dto';

@Injectable({
  providedIn: 'root'
})
export class PriceSubscriberService implements WsConsumer{
  subscribed = false;

  constructor(private ws: WebsocketService,
              private pricesCalculationService: PricesCalculationService,
              private snack: SnackService,
              private log: NGXLogger) {
  }


  isSubscribed(): boolean {
    return this.subscribed;
  }

  setSubscribed(s: boolean): void {
    this.subscribed = s;
  }

  public initWs(): void {
    if (this.ws.registerConsumer(this) && !this.subscribed) {
      this.subscribeToTopic();
    }
  }

  public subscribeToTopic(): void {
    this.subscribed = true;
    this.ws.onMessage('/topic/prices', (m => PricesDto.fromJson(m.body)))
    ?.subscribe(tx => {
      try {
        this.log.debug('price from ws', tx);
        this.pricesCalculationService.savePrice(tx);
      } catch (e) {
        this.log.error('Error ws price', e, tx);
      }
    });
  }
}
