import {Inject, Injectable} from '@angular/core';
import {forkJoin, Observable, Subscriber} from 'rxjs';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {HttpService} from './http.service';
import {WsConsumer} from '../ws-consumer';
import {WebsocketService} from '../websocket.service';
import {Paginated} from '@data/models/paginated';
import {StaticValues} from '@data/static/static-values';
import {Network} from '@data/models/network';
import {map} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../../../app.config';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class HardworksService implements WsConsumer {
  private subscribed = false;
  private $subscribers: Subscriber<HardWorkDto>[] = [];

  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      private httpService: HttpService,
      private ws: WebsocketService) {
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
    this.ws.onMessage('/topic/hardwork', (m => HardWorkDto.fromJson(m.body)))
    ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
  }

  /**
   * ONLY FOR DATA SERVICE
   */
  subscribeToHardworks(): Observable<HardWorkDto> {
    return new Observable(subscriber => {
      this.$subscribers.push(subscriber);
    });
  }

  // ------------------- REST REQUESTS ---------------------

  getGasSaved(network: Network): Observable<string> {
    return this.httpService.httpGet('/last_saved_gas_sum', network);
  }

  getHardWorkHistoryData(network: Network, reduce = 10): Observable<HardWorkDto[]> {
    return this.httpService.httpGet('/api/transactions/history/hardwork?reduce=' + reduce, network);
  }

  getHardWorkHistoryDataByAddress(address: string, network: Network): Observable<HardWorkDto[]> {
    return this.httpService.httpGet(`/api/transactions/history/hardwork/${address}`, network);
  }

  getAllLastHardWorks(): Observable<HardWorkDto[]> {
    return this.httpService.httpGetWithNetwork('/api/transactions/last/hardwork');
  }

  getPaginatedHardworkHistoryData(
      pageSize: number = 10,
      pageNumber: number = 0,
      vault?: string,
      minAmount: number = -1,
      ordering: string = 'desc',
      network: Network = StaticValues.NETWORKS.get('eth')):
      Observable<Paginated<HardWorkDto>> {
    const urlAtr = `/hardwork/pages` +
        `?pageSize=${pageSize}`
        + `&page=${pageNumber}`
        + `${vault ? `&vault=${vault}` : ''}`
        + `${minAmount ? `&minAmount=${minAmount}` : ''}`
        + `&ordering=${ordering}`;
    if (this.config.multipleSources) {
      return this.httpService.httpGet(urlAtr, network);
    } else {
      return this.httpService.httpGetWithNetwork(urlAtr);
    }
  }

  getLastHardWorks(size: number): Observable<HardWorkDto[]> {
    if (this.config.multipleSources) {
      return forkJoin([
        this.getPaginatedHardworkHistoryData(
            size, 0, '', -1, 'desc', StaticValues.NETWORKS.get('eth')),
        this.getPaginatedHardworkHistoryData(
            size, 0, '', -1, 'desc', StaticValues.NETWORKS.get('bsc'))
      ]).pipe(
          map(restResponses => restResponses.map(resp => resp?.data)),
          map(x => x.flat())
      );
    } else {
      return this.getPaginatedHardworkHistoryData(size, 0, '', 0, 'desc')
      .pipe(
          map(el => el?.data)
      );
    }
  }
}
