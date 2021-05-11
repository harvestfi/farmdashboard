import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Lps} from '../models/lps';
import {IContract} from '../models/icontract';
import {APP_CONFIG, AppConfig} from '../../app.config';
import {HttpService} from './http/http.service';
import {NGXLogger} from 'ngx-logger';

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

    private cache = new Map<string, Observable<Map<string, IContract>>>();
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
        private log: NGXLogger) {
    }

    /**
     * Fetch a list of contracts by type, e.g. Vault, Pool, Token, Pair
     */
    getContracts<T extends IContract>(type: new () => T): Observable<Map<string, T>> {
        const typeName = this.typePaths.get(type);
        if (!typeName) {
            this.log.error('Type not found', new type());
            throw new Error(`Invalid type ${type}`);
        }
        if (!this.cache.has(typeName)) {
            const obs = this.requestContracts<T>(type)
                .pipe(
                    shareReplay(1),
                    map(_ => {
                        const m = new Map<string,T>();
                        (_ as any[]).forEach(v => {
                            m.set(v?.contract?.name, v);
                        });
                        return m;
                    })
                );
            this.cache.set(typeName, obs);
        }
        // @ts-ignore
        return this.cache.get(typeName);
    }

    getContractsArray<T extends IContract>(type: new () => T): Observable<T[]> {
        return this.getContracts(type)?.pipe(
            map(_ => Array.from(_.values()))
        );
    }

    private requestContracts<T extends IContract>(type: new () => T): Observable<T[]> {
        return this.httpService.httpGetWithNetwork(`/${this.urlPrefix}/${this.typePaths.get(type)}s`)
        .pipe(
            map((val: T[]) => val?.map(o => Object.assign(new type(), o)) as T[])
        );
    }

}
