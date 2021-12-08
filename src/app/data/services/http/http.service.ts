import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SnackBarService} from '@shared/snack-bar/snack-bar.service';
import {forkJoin, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TransferDto} from '@data/models/transfer-dto';
import {Balance} from '@data/models/balance';
import {Network} from '@data/models/network';
import {StaticValues} from '@data/static/static-values';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {NGXLogger} from 'ngx-logger';
import {RestResponse} from '@data/models/rest-response';
import {Paginated} from '@data/models/paginated';
import get = Reflect.get;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  localApi = window.document.location.host === 'localhost:4200' ? 'http://localhost:8080' : '';
  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      private http: HttpClient,
      private snackService: SnackBarService,
      private log: NGXLogger
  ) {
  }

  public httpGetWithNetwork<T>(
      urlAtr: string
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
        const url = get(this.config.apiEndpoints, netName)
            + `${urlAtr}network=${netName}`;
        this.log.debug('HTTP get for network ' + netName, url);
        observables.push(this.http.get<T>(url));
      });
      // todo create correct typification
      // @ts-ignore
      request = forkJoin(observables)
      .pipe(
          map(x => {
            // this.log.info('get data from response for ' + urlAtr, RestResponse.isRestResponse(x), x);
            if (RestResponse.isRestResponse(x[0])) {
              return x.map(el => get(el as any, 'data'));
            }
            return x;
          }),
          map(x => x.flat())
      );
    } else {
      const url = get(this.config.apiEndpoints, this.config.defaultNetwork)
          + `${urlAtr}network=${this.config.defaultNetwork}`;
      this.log.debug('HTTP get for network ' + this.config.defaultNetwork, url);
      request = this.http.get<T>(url).pipe(
          map(x => {
            // this.log.info('loaded by ' + url, x);
            if (RestResponse.isRestResponse(x)) {
              // this.log.info('get data from response for ' + url);
              return get(x as any, 'data');
            }
            return x;
          }),
      );
    }

    return request.pipe(
        // filter(x => !!x),
        catchError(this.snackService.handleError<T>(urlAtr + ' error'))
    );
  }

  public httpGet<T>(
      urlAtr: string,
      network: Network = StaticValues.NETWORKS.get('eth')
  ): Observable<T> {
    if (urlAtr.indexOf('?') < 0) {
      urlAtr += '?';
    } else {
      urlAtr += '&';
    }
    const url = get(this.config.apiEndpoints, network.ethparserName)
        + `${urlAtr}network=${network.ethparserName}`;
    this.log.debug('HTTP simple get for network ' + network.ethparserName, url);
    return this.http.get<T>(url).pipe(
        map(x => this.handleResponse(x, urlAtr)),
        catchError(this.snackService.handleError<T>(url + ' error'))
    );
  }

  getAddressHistoryTransfers(address: string): Observable<TransferDto[]> {
    return this.httpGet('/history/transfer/' + address);
  }

  getUserBalances(): Observable<Balance[]> {
    return this.httpGetWithNetwork('/user_balances');
  }

  getMaticPrices(): Observable<{ usd: number }> {
      return this.http.get<{ usd: number }>(`${this.localApi}/matic-info`);
  }

  private handleResponse(x: any, url: string): any {
    if (RestResponse.isRestResponse(x)) {
      if (get(x as any, 'code') === '200') {
        return get(x as any, 'data');
      } else {
        this.log.error(`Error get ${url} ${x.status}`);
        return Paginated.empty();
      }
    }
    return x;
  }

}
