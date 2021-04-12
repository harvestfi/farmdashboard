import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';
import {SnackService} from './snack.service';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Lps} from '../models/lps';
import {IContract} from '../models/icontract';
import {RestResponse} from '../models/rest-response';
import {APP_CONFIG, AppConfig} from '../../app.config';

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
    private apiEndPoint: string;

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
        //todo temporally use parser url
        this.apiEndPoint = config.wsEndpoint.replace('/stomp', '');
    }

    /**
     * Fetch a list of contracts by type, e.g. Vault, Pool, Token, Pair
     * Uses a cache per type and stores a buffer size of 1 (it's a full list of items)
     * Refreshes this buffer every 5 minutes.
     *
     * @param type
     */
    getContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        if(!this.cache.has(type)){
            this.cache.set(type, this.requestContracts<T>(type));
        }
        return this.cache.get(type);
    }

    private requestContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        return this.http.get(`${this.apiEndPoint}/${this.urlPrefix}/${this.typePaths.get(type)}s`).pipe(
            catchError(this.snackService.handleError<RestResponse<T[]>>(`Contracts fetch for ${this.typePaths.get(type)} failed.`)),
            map((val: RestResponse<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[]),
        );
    }

}
