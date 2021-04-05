import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {SnackService} from './snack.service';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Pair} from '../models/pair';

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

    private urlPrefix = 'contracts';
    private typePaths = new Map<new () => Vault|Pool|Token|Pair, string>(
        [[Vault, 'vault'],
            [Pool, 'pool'],
            [Token, 'token'],
            [Pair, 'unipair']]
    );

    constructor(private http: HttpClient, private snackService: SnackService) {

    }

    getContracts<T extends Vault|Pool|Token|Pair>(type: new () => T): Observable<T[]> {
        return this.http.get(`${environment.apiEndpoint}/${this.urlPrefix}/${this.typePaths.get(type)}s`).pipe(
            catchError(this.snackService.handleError<ContractsResult<T[]>>(`Contracts fetch for ${this.typePaths.get(type)} failed.`)),
            map((val: ContractsResult<T[]>) => (val.data as T[]).map(o => Object.assign(new type(), o)) as T[]),
            map(_ => _.filter(item => !(item instanceof Vault) || !(item.contract?.name?.match(/_V0$/))))
        );
    }

}
