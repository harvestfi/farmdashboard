import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SnackService} from '../snack.service';
import {forkJoin, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UniswapDto} from '../../models/uniswap-dto';
import {TransferDto} from '../../models/transfer-dto';
import {OhlcDto} from '../../models/ohlc-dto';
import {PricesDto} from '../../models/prices-dto';
import {Balance} from '../../models/balance';
import {Network} from '../../models/network';
import {StaticValues} from '../../static/static-values';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {NGXLogger} from 'ngx-logger';
import get = Reflect.get;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      private http: HttpClient,
      private snackService: SnackService,
      private log: NGXLogger
  ) {
  }

  public httpGetWithNetwork<T>(
      urlAtr: string,
      network: Network = StaticValues.NETWORKS.get(this.config.defaultNetwork),
      mapper = (x: T[]) => x.flat() // only for multiple sources
  ): Observable<T> {
    if (urlAtr.indexOf('?') < 0) {
      urlAtr += '?';
    } else {
      urlAtr += '&';
    }
    let request: Observable<T>;
    if (this.config.multipleSources) {
      const observables: Observable<T>[] = [];
      Object.keys(this.config.apiEndpoints)
      ?.forEach(netName => {
        const url = get(this.config.apiEndpoints, netName, this.config.apiEndpoint)
            + `${urlAtr}network=${netName}`;
        this.log.info('HTTP get for network ' + netName, url);
        observables.push(this.http.get<T>(url));
      });
      // todo create correct typification
      // @ts-ignore
      request = forkJoin(observables)
      .pipe(
          map(x => mapper(x)),
      );
    } else {
      const url = get(this.config.apiEndpoints, network.ethparserName, this.config.apiEndpoint)
          + `${urlAtr}network=${network.ethparserName}`;
      this.log.info('HTTP get for network ' + network.ethparserName, url);
      request = this.http.get<T>(url);
    }

    return request
    .pipe(
        catchError(this.snackService.handleError<T>(urlAtr + ' error'))
    );
  }

  getUniswapTxHistoryData(): Observable<UniswapDto[]> {
    return this.httpGetWithNetwork('/api/transactions/history/uni');
  }

  getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
    return this.httpGetWithNetwork(`/api/transactions/history/uni?from=${minBlock}&to=${maxBlock}`);
  }

  getAddressHistoryTransfers(address: string): Observable<TransferDto[]> {
    return this.httpGetWithNetwork('/history/transfer/' + address);
  }

  getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
    return this.httpGetWithNetwork('/api/transactions/history/uni/ohcl/' + coin);
  }

  getUserBalances(): Observable<Balance[]> {
    return this.httpGetWithNetwork('/user_balances');
  }

}
