import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Vault} from '../models/vault';
import {Token} from '../models/token';
import {Pool} from '../models/pool';
import {Lps} from '../models/lps';
import {IContract} from '../models/icontract';
import {APP_CONFIG, AppConfig} from '../../app.config';
import {HttpService} from './http/http.service';
import {NGXLogger} from 'ngx-logger';
import {Strategy} from '../models/strategy';

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

  private cache = new Map<string, Map<string, IContract>>();
  private urlPrefix = 'contracts';
  private typePaths = new Map<IContract, string>(
      [[Vault, 'vaults'],
        [Pool, 'pools'],
        [Strategy, 'strategies'],
        [Token, 'tokens'],
        [Lps, 'lps']]
  );

  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      private httpService: HttpService,
      private log: NGXLogger) {
  }

  /**
   * Fetch a list of contracts by type, e.g. Vault, Pool, Token, Pair
   */
  getContracts<T extends IContract>(type: new () => T): Map<string, T> {
    const typeName = this.typePaths.get(type);
    if (!typeName) {
      this.log.error('Type not found', new type());
      return new Map();
    }
    if (!this.cache.has(typeName)) {
      this.cache.set(typeName, new Map());
      this.requestContracts<T>(type).subscribe(contracts => {
        this.log.debug('Loaded contracts ' + typeName, contracts);
        contracts.forEach(c => {
          this.cache.get(typeName).set((c as any).contract.address, c);
        });
      });
    }
    // @ts-ignore
    return this.cache.get(typeName);
  }

  getContractsArray<T extends IContract>(type: new () => T): T[] {
    return Array.from(this.getContracts(type)?.values());
  }

  getContractName(address: string) {
    if (this.getContracts(Vault).has(address)) {
      return this.getContracts(Vault).get(address).contract.name;
    } else if (this.getContracts(Token).has(address)) {
      return this.getContracts(Token).get(address).contract.name;
    } else if (this.getContracts(Pool).has(address)) {
      return this.getContracts(Pool).get(address).contract.name;
    } else if (this.getContracts(Lps).has(address)) {
      return this.getContracts(Lps).get(address).contract.name;
    }
  }

  private requestContracts<T extends IContract>(type: new () => T): Observable<T[]> {
    return this.httpService.httpGetWithNetwork(`/${this.urlPrefix}/${this.typePaths.get(type)}`)
    .pipe(
        map((val: T[]) => val?.map(o => Object.assign(new type(), o)) as T[])
    );
  }

}
