import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {UniswapDto} from '@data/models/uniswap-dto';
import {HttpService} from './http.service';
import {OhlcDto} from '@data/models/ohlc-dto';
import {Paginated} from '@data/models/paginated';
import {Addresses} from '@data/static/addresses';

@Injectable({
  providedIn: 'root'
})

/**
 * @deprecated Uniswipe feed will be removed soon
 */
export class UniswapService {

  constructor(private httpService: HttpService,
              private log: NGXLogger) {
  }

  // ------------------- REST REQUESTS ---------------------

  getUniswapTxHistoryData(): Observable<UniswapDto[]> {
    return this.httpService.httpGet('/api/transactions/history/uni');
  }

  getUniswapPaginatedTxHistoryData(
      pageNumber: number = 0,
      pageSize: number = 10,
      minAmount: number = 0,
      ordering: string = 'desc'
  ): Observable<Paginated<UniswapDto>> {
    const apiUrl = `/uni/pages?`
        + `pageSize=${pageSize}`
        + `&page=${pageNumber}`
        + `${minAmount ? '&minAmount=' + minAmount : ''}`
        + `&ordering=${ordering}` +
        `&token=${Addresses.ADDRESSES.get('FARM')}`;

    return this.httpService.httpGet(apiUrl);
  }

  getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
    return this.httpService.httpGet(`/api/transactions/history/uni?`
        + `from=${minBlock}`
        + `&to=${maxBlock}`);
  }

  getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
    return this.httpService.httpGet('/api/transactions/history/uni/ohcl/' + coin);
  }
}
