import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SnackService} from './snack.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UniswapDto} from '../models/uniswap-dto';
import {TransferDto} from '../models/transfer-dto';
import {OhlcDto} from '../models/ohlc-dto';
import {PricesDto} from '../models/prices-dto';
import {Balance} from '../models/balance';
import {Vault} from '../models/vault';
import { AppConfig, APP_CONFIG } from 'src/app.config';
import {Network} from '../models/network';
import {StaticValues} from '../static/static-values';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = '/api/transactions';
  private apiEndpoint;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
    this.apiEndpoint = config.apiEndpoint;
    console.log('apiEndpoint is: ' + this.apiEndpoint);
  }

  getUniswapTxHistoryData(network: Network  = StaticValues.NETWORK_ETH): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(this.apiEndpoint + `${this.url}/history/uni`).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`Uni history`))
    );
  }

  getUniswapTxHistoryByRange(minBlock: number, maxBlock: number, network: Network  = StaticValues.NETWORK_ETH): Observable<UniswapDto[]> {
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
