import {Observable, Subscriber} from 'rxjs';
import {HarvestDto} from '@data/models/harvest-dto';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {WsConsumer} from '../ws-consumer';
import {WebsocketService} from '../websocket.service';
import {SnackBarService} from '@shared/snack-bar/snack-bar.service';
import {Network} from '@data/models/network';
import {Paginated} from '@data/models/paginated';
import {HarvestVaultInfo} from "@data/models/harvest-vault-info";

@Injectable({
  providedIn: 'root'
})
export class HarvestsService implements WsConsumer {

  private $subscribers: Subscriber<HarvestDto>[] = [];
  private subscribed = false;

  constructor(
      private httpService: HttpService,
      private ws: WebsocketService,
      private snack: SnackBarService,
  ) {
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
    this.ws.onMessage('/topic/harvest', (m => HarvestDto.fromJson(m.body)))?.subscribe(tx => {
      this.snack.openSnack(tx.print());
      this.$subscribers.forEach(_ => _.next(tx));
    });
  }

  /**
   * ONLY FOR DATA SERVICE
   */
  subscribeToHarvests(): Observable<HarvestDto> {
    return new Observable(subscriber => {
      this.$subscribers.push(subscriber);
    });
  }

  // ------------------- REST REQUESTS ---------------------

  getHarvestTxHistoryByRange(minBlock: number, maxBlock: number, network: Network): Observable<HarvestDto[]> {
    return this.httpService.httpGet(`/api/transactions/history/harvest?from=${minBlock}&to=${maxBlock}&reduce=10`, network);
  }

  getHarvestHistoryByVault(address: string, network: Network): Observable<HarvestDto[]> {
    return this.httpService.httpGet(`/api/transactions/history/harvest/${address}?reduce=10`, network);
  }

  getLastTvls(): Observable<HarvestDto[]> {
    return this.httpService.httpGetWithNetwork('/api/transactions/last/harvest');
  }

  getAddressHistoryHarvest(address: string): Observable<HarvestDto[]> {
    return this.httpService.httpGetWithNetwork('/history/harvest/' + address);
  }

  getHarvestTxHistoryData(): Observable<HarvestDto[]> {
    return this.httpService.httpGetWithNetwork(`/api/transactions/history/harvest`);
  }

  getHarvestPaginatedTxHistoryData(
      pageNumber: number = 1,
      pageSize: number = 10,
      minAmount: number = 0,
      vault?: string,
      ordering: string = 'desc'
  ): Observable<Paginated<HarvestDto>> {
    const apiUrl = `/harvest/pages?`
        + `pageSize=${pageSize}`
        + `&page=${pageNumber}`
        + `${minAmount ? '&minAmount=' + minAmount : ''}`
        + `${vault ? '&vault=' + vault : ''}`
        + `&ordering=${ordering}`;
    return this.httpService.httpGet(apiUrl);
  }

  getHarvestVaultInfo(): Observable<HarvestVaultInfo[]> {
    return this.httpService.httpGet('/harvest/vaults');
  }
}
