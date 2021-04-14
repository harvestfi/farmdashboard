import { Injectable } from '@angular/core';
import {WsConsumer} from './ws-consumer';
import {WebsocketService} from './websocket.service';
import {PricesCalculationService} from './prices-calculation.service';
import {SnackService} from './snack.service';
import {NGXLogger} from 'ngx-logger';
import {HardWorkDto} from '../models/hardwork-dto';
import {PricesDto} from '../models/prices-dto';
import {Observable, Subscriber} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PriceSubscriberService implements WsConsumer {
  subscribed = false;
  private $subscribers: Subscriber<PricesDto>[] = [];

  constructor(private ws: WebsocketService,
              private log: NGXLogger) {
    this.initWs();
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
      this.subscribed = true;
    }
  }

  public subscribeToTopic(): void {
      this.ws.onMessage('/topic/prices', (m => PricesDto.fromJson(m.body)))
          ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
  }

  public subscribeToPrices(): Observable<PricesDto> {
    return new Observable(subscriber => {
      this.$subscribers.push(subscriber);
    })
  }
}
