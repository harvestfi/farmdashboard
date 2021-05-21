import {Observable, Subscriber} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {PricesDto} from '../../models/prices-dto';
import {WebsocketService} from '../websocket.service';
import {WsConsumer} from '../ws-consumer';
import {Network} from '../../models/network';

@Injectable({
  providedIn: 'root'
})
export class PricesService implements WsConsumer {

  subscribed = false;
  private $subscribers: Subscriber<PricesDto>[] = [];

  constructor(private ws: WebsocketService,
              private httpService: HttpService) {
    this.ws.registerConsumer(this);
  }

  /**
   * DON'T USE! for parent class only
   */
  isSubscribed(): boolean {
    return this.subscribed;
  }

  /**
   * DON'T USE! for parent class only
   */
  setSubscribed(s: boolean): void {
    this.subscribed = s;
  }

  /**
   * DON'T USE! for parent class only
   */
  subscribeToTopic(): void {
    this.ws.onMessage('/topic/prices', (m => PricesDto.fromJson(m.body)))
    ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
  }

  /**
   * ONLY FOR DATA SERVICE
   */
  public subscribeToPrices(): Observable<PricesDto> {
    return new Observable(subscriber => {
      this.$subscribers.push(subscriber);
    });
  }

  // ------------------- REST REQUESTS ---------------------

  public getLastPrices(): Observable<PricesDto[]> {
    return this.httpService.httpGetWithNetwork('/price/token/latest');
  }

  public getLastPrice(address: string, network: Network): Observable<PricesDto> {
    return this.httpService.httpGet('/price/token/dto/' + address, network);
  }

}
