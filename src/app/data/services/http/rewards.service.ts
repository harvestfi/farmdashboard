import {Observable, Subscriber} from 'rxjs';
import {Injectable} from '@angular/core';
import {RewardDto} from '@data/models/reward-dto';
import {HttpService} from './http.service';
import {WebsocketService} from '../websocket.service';
import {WsConsumer} from '../ws-consumer';
import {Network} from '@data/models/network';
import {StaticValues} from '@data/static/static-values';
import { Paginated } from '@data/models/paginated';

@Injectable({
  providedIn: 'root'
})
export class RewardsService implements WsConsumer {
  private $subscribers: Subscriber<RewardDto>[] = [];
  private subscribed = false;

  constructor(private httpService: HttpService,
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
    this.ws.onMessage('/topic/rewards', (m => RewardDto.fromJson(m.body)))?.subscribe(tx => {
      this.$subscribers.forEach(_ => _.next(tx));
    });
  }

  /**
   * ONLY FOR DATA SERVICE
   */
  subscribeToRewards(): Observable<RewardDto> {
    return new Observable(subscriber => {
      this.$subscribers.push(subscriber);
    });
  }

  // ------------------- REST REQUESTS ---------------------

  getLastRewards(): Observable<RewardDto[]> {
    return this.httpService.httpGetWithNetwork('/api/transactions/last/reward');
  }

  getHistoryRewards(name: string, network: Network): Observable<RewardDto[]> {
    return this.httpService.httpGet('/api/transactions/history/reward/' + name + '?reduce=10', network);
  }

  getAllHistoryRewards(startTimestamp?: number, endTimestamp?: number): Observable<RewardDto[]> {
    startTimestamp = Math.floor(startTimestamp || (new Date(0).getTime() / 1000));
    endTimestamp = Math.floor(endTimestamp || (Date.now() / 1000));
    return this.httpService.httpGetWithNetwork(
        `/api/transactions/history/reward/?start=${startTimestamp}&end=${endTimestamp}`);
  }

  getAllHistoryRewardsByNetwork(network: Network = StaticValues.NETWORKS.get('eth')): Observable<RewardDto[]> {
    return this.httpService.httpGet(`/api/transactions/history/reward`, network);
  }

  getPaginatedHistoryRewards(
    pageSize: number = 10,
    page: number = 0,
    minAmount: number = -1,
    ordering: string = 'desc',
    vault?: string,
    network: Network = StaticValues.NETWORKS.get('eth')
    ): Observable<Paginated<RewardDto>> {
    return this.httpService.httpGet(
      `/reward/pages?pageSize=${pageSize}&page=${page}&minAmount=${minAmount}&ordering=${ordering}${vault ? `&vault=${vault}` : ''}`,
    network);
  }

}
