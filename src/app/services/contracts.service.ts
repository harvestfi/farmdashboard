import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';
import {SnackService} from './snack.service';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Lps} from '../models/Lps';
import {IContract} from '../models/icontract';
import {RestResponse} from '../models/rest-response';

/**
 * Usage:
 * const service = new ContractsService(httpClient, snackService);
 * service.getContracts(Vault)  => Array<Vault>
 * service.getContracts(Pool)  => Array<Pool>
 * service.getContracts(Token)  => Array<Token>
 *
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

    constructor(private http: HttpClient, private snackService: SnackService) {

    }

    /**
     * Fetch a list of contracts by type, e.g. Vault, Pool, Token, Pair
     *
     * @param type
     */
    getContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        if(!this.cache.has(type)){
            const pipeline: Observable<T[]> = timer(0, 300000).pipe(
                switchMap(() => this.requestContracts<T>(type)),
                shareReplay(1)
            );
            this.cache.set(type, pipeline);
        }
        return this.cache.get(type);
    }

    private requestContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        return this.http.get(`${environment.apiEndpoint}/${this.urlPrefix}/${this.typePaths.get(type)}s`).pipe(
            catchError(this.snackService.handleError<RestResponse<T[]>>(`Contracts fetch for ${this.typePaths.get(type)} failed.`)),
            map((val: RestResponse<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[]),
            map(_ => _.filter(item => !(item instanceof Vault) || !(item.contract?.name?.match(/_V0$/)))) // filter older vaults
        );
    }

}
