import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, filter, map} from 'rxjs/operators';
import {SnackService} from './snack.service';
import {StaticValues} from '../static/static-values';
import {Addresses} from '../static/addresses';

interface Result<T> {
    data: T | Array<T>;
}

// eslint-disable-next-line
export interface IsContract{}

export class Contract implements IsContract {
    id: number;
    address: string;
    name: string;
    prettyName() {
        return this.name
            ?.replace('SUSHI_', '')
            ?.replace('ONEINCH_', '')
            ?.replace('UNI_LP_', '')
            ?.replace('UNI_', '')
            ?.replace('ST_', '')
            ?.replace('_HODL', '_H')
            ?.replace('HODL', 'SUSHI_HODL');
    }
    created: number;
    type: number;
}

export class Vault implements IsContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    controller: Contract;
    governance: Contract;
    strategy: Contract;
    underlying: Contract;
    name: string;
    symbol: string;
    decimals: number;
    underlyingUnit: number;
    isStableCoin() {
        return this.underlying?.type === 4 && !this.contract?.name?.match(/CRV/);
    }
    isCRV() {
        return this.underlying?.type === 4 && this.contract?.name?.match(/CRV/);
    }
    isUniLP() {
        return this.underlying?.type === 2 && this.underlying?.name?.match(/^UNI_LP/);
    }
    isOtherLP() {
        return this.underlying?.type === 2 && !this.underlying?.name?.match(/^UNI_LP/);
    }
}

export class Pool implements IsContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    controller: Contract;
    governance: Contract;
    owner: Contract;
    lpToken: Contract;
    rewardToken: Contract;
}

export class Token implements IsContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    name: string;
    symbol: string;
    decimals: number;
}

export class Pair implements IsContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    keyToken: Token;
    type: number;
    decimals: number;
    token0: Contract;
    token1: Contract;
}

interface Service<T extends IsContract> {
    getContract(type: new () => T, name: string): Observable<T>;
    getContracts(type: new () => T): Observable<T[]>;
}

const TYPE_PATHS = new Map<IsContract, string>([[Vault, 'vault'], [Pool, 'pool'], [Token, 'token'], [Pair, 'unipair']]);

@Injectable({
    providedIn: 'root'
})
export class ContractsService<T> implements Service<T> {

    private urlPrefix = 'contracts';

    constructor(private http: HttpClient, private snackService: SnackService) {

    }

    getContract(type: new () => T, name: string): Observable<T> {
        return this.http.get(`${environment.apiEndpoint}/${this.urlPrefix}/${TYPE_PATHS.get(type)}/${name}`).pipe(
            catchError(this.snackService.handleError<Result<T>>(`Contract fetch for ${TYPE_PATHS.get(type)} ${name} failed.`)),
            map((val: Result<T>) => Object.assign(new type(), val.data) as T)
        );
    }

    getContracts(type: new () => T): Observable<T[]> {
        return this.http.get(`${environment.apiEndpoint}/${this.urlPrefix}/${TYPE_PATHS.get(type)}s`).pipe(
            catchError(this.snackService.handleError<Result<T>>(`Contracts fetch for ${TYPE_PATHS.get(type)} failed.`)),
            map((val: Result<T>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[]),
            map(_ => _.filter(item => !(item instanceof Vault) && !item.contract?.name?.match(/_V0$/)))
        );
    }

}

@Injectable({
    providedIn: 'root'
})
export class StaticContractsService implements Service<Vault|Pool> {

    private readonly vaults: Vault[];
    private index: Map<string, number> = new Map();

    constructor() {
        this.vaults = StaticValues.currentVaults.map(v => ({contract: {name: v, address: Addresses[v] || Addresses[`_${v}`]}} as Vault));
        this.vaults.forEach((v, idx) => this.index[v.contract.name] = name);
    }

    getContract(type: new () => Vault, name: string): Observable<Vault> {
        return new Observable((subscriber) => {
            if(!this.index.has(name)) {
                subscriber.error(new Error(`Unable to find contract by the name ${name}`));
            } else {
                subscriber.next(this.vaults[this.index.get(name)]);
            }
        });
    }

    getContracts(type: new () => Vault): Observable<Vault[]> {
        return new Observable((subscriber) => {
            subscriber.next(this.vaults);
        });
    }
}
