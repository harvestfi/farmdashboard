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

  private url = '/api/transactions';
  private apiEndpoint;

  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      private http: HttpClient,
      private snackService: SnackService,
      private log: NGXLogger
  ) {
    this.apiEndpoint = config.apiEndpoint;
    console.log('apiEndpoint is: ' + this.apiEndpoint);
  }

  public httpGetWithNetwork<T>(
      urlAtr: string,
      network: Network,
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
      .forEach(netName => {
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
      request = this.http.get<T>(
          get(this.config.apiEndpoints, network.ethparserName, this.config.apiEndpoint)
          + `${urlAtr}network=${network.ethparserName}`
      );
    }

    return request
    .pipe(
        catchError(this.snackService.handleError<T>(urlAtr + ' error'))
    );
  }

  getUniswapTxHistoryData(network: Network = StaticValues.NETWORK_ETH): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(this.apiEndpoint + `${this.url}/history/uni`).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`Uni history`))
    );
  }

  getUniswapTxHistoryByRange(minBlock: number, maxBlock: number, network: Network = StaticValues.NETWORK_ETH): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(this.apiEndpoint + `${this.url}/history/uni?from=${minBlock}&to=${maxBlock}`).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`Uni history`))
    );
  }

  getAddressHistoryUni(address: string, network: Network  = StaticValues.NETWORK_ETH): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(this.apiEndpoint + '/history/uni/' + address).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`history address uni `))
    );
  }

  getAddressHistoryTransfers(address: string, network: Network  = StaticValues.NETWORK_ETH): Observable<TransferDto[]> {
    return this.http.get<TransferDto[]>(this.apiEndpoint + '/history/transfer/' + address).pipe(
        catchError(this.snackService.handleError<TransferDto[]>(`history address transfers `))
    );
  }

  getUniswapOHLC(coin: string, network: Network  = StaticValues.NETWORK_ETH): Observable<OhlcDto[]> {
    return this.http.get<OhlcDto[]>(this.apiEndpoint + '/api/transactions/history/uni/ohcl/' + coin).pipe(
        catchError(this.snackService.handleError<OhlcDto[]>(`history ohlc`))
    );
  }

  getLastPrices(network: Network  = StaticValues.NETWORK_ETH): Observable<PricesDto[]> {
    return this.http.get<PricesDto[]>(this.apiEndpoint + '/price/token/latest').pipe(
        catchError(this.snackService.handleError<PricesDto[]>(`last price `))
    );
  }

  getUserBalances(network: Network  = StaticValues.NETWORK_ETH): Observable<Balance[]> {
    return this.http.get<Balance[]>(this.apiEndpoint + '/user_balances').pipe(
        catchError(this.snackService.handleError<Balance[]>(`load balances`))
    );
  }

}
