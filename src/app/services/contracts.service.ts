import {Inject, Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {SnackService} from './snack.service';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Lps} from '../models/lps';
import {IContract} from '../models/icontract';
import {RestResponse} from '../models/rest-response';
import {APP_CONFIG, AppConfig} from '../../app.config';
import {HttpService} from './http/http.service';
import {StaticValues} from '../static/static-values';

/**
 * Usage:
 * const service = new ContractsService(appConfig, httpClient, snackService);
 * service.getContracts(Vault)  => Array<Vault>
 * service.getContracts(Pool)   => Array<Pool>
 * service.getContracts(Token)  => Array<Token>
 * service.getContracts(Pair)   => Array<Pair>
 */
@Injectable({
    providedIn: 'root'
})
export class ContractsService {

    private cache = new Map<IContract, Observable<any[]>>();
    private urlPrefix = 'contracts';
    private typePaths = new Map<IContract, string>(
        [[Vault, 'vault'],
            [Pool, 'pool'],
            [Token, 'token'],
            [Lps, 'unipair']]
    );

    constructor(
        @Inject(APP_CONFIG) public config: AppConfig,
        private httpService: HttpService,
        private snackService: SnackService) {
    }

    /**
     * Fetch a list of contracts by type, e.g. Vault, Pool, Token, Pair
     * Uses a cache per type and stores a buffer size of 1 (it's a full list of items)
     *
     * @param type
     */
    getContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        if (!this.cache.has(type)) {
            this.cache.set(type, this.requestContracts<T>(type).pipe(shareReplay(1)));
        }
        return this.cache.get(type);
    }

    private requestContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        if (this.config.multipleSources) {
            return this.requestContractsMultiple(type);
        } else {
            return this.httpService.httpGetWithNetwork(`/${this.urlPrefix}/${this.typePaths.get(type)}s`)
            .pipe(
                map((val: RestResponse<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[])
            );
        }
    }

    private requestContractsMultiple<T extends IContract>(type: new () => T): Observable<T[]> {
        return forkJoin(
            this.httpService.httpGet(`/${this.urlPrefix}/${this.typePaths.get(type)}s`,
                StaticValues.NETWORKS.get('eth'))
            .pipe(
                map((val: RestResponse<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[])
            ),
            this.httpService.httpGet(`/${this.urlPrefix}/${this.typePaths.get(type)}s`,
                StaticValues.NETWORKS.get('bsc'))
            .pipe(
                map((val: RestResponse<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[])
            ))
        .pipe(
            map(x => x.flat())
        );
    }

}
