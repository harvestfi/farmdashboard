import {Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {PricesCalculationService} from './prices-calculation.service';
import {SnackService} from './snack.service';
import {NGXLogger} from 'ngx-logger';
import {HardWorkDto} from '../models/hardwork-dto';
import {WsConsumer} from './ws-consumer';

@Injectable({
  providedIn: 'root'
})
export class HardworkSubscriberService implements WsConsumer {
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
    this.ws.onMessage('/topic/hardwork', (m => HardWorkDto.fromJson(m.body)))
    .subscribe(tx => {
      try {
        this.log.debug('hardwork from ws', tx);
        this.pricesCalculationService.saveHardWork(tx);
      } catch (e) {
        this.log.error('Error hardwork', e, tx);
      }
    });
  }
}
