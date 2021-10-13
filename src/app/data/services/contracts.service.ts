import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vault } from '@data/models/vault';
import { Token } from '@data/models/token';
import { Pool } from '@data/models/pool';
import { Lps } from '@data/models/lps';
import { IContract } from '@data/models/icontract';
import { APP_CONFIG, AppConfig } from '../../../app.config';
import { HttpService } from './http/http.service';
import { NGXLogger } from 'ngx-logger';
import { Strategy } from '@data/models/strategy';
import { Subject } from 'rxjs';

/**
 * Usage:
 * const service = new ContractsService(appConfig, httpClient, snackService);
 * service.getContracts(Vault)  => Array<Vault>
 * service.getContracts(Pool)   => Array<Pool>
 * service.getContracts(Token)  => Array<Token>
 * service.getContracts(Pair)   => Array<Pair>
 */
@Injectable({
  providedIn: 'root',
})
export class ContractsService {

  private cache = new Map<string, Map<string, IContract>>();
  private cache$ = new Map<string, Subject<Map<string, IContract>>>();
  private urlPrefix = 'contracts';
  private typePaths = new Map<IContract, string>(
    [[Vault, 'vaults'],
      [Pool, 'pools'],
      [Strategy, 'strategies'],
      [Token, 'tokens'],
      [Lps, 'lps']],
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
      this.cache$.set(typeName, new Subject());

      this.requestContracts<T>(type).subscribe(contracts => {
        this.log.debug('Loaded contracts ' + typeName, contracts);
        contracts.forEach(c => {
          this.cache.get(typeName).set((c as any).contract.address, c);
        });

        this.cache$.get(typeName).next(this.cache.get(typeName));
      });
    }
    // @ts-ignore
    return this.cache.get(typeName);
  }

  getContracts$<T extends IContract>(type: new () => T): Observable<any[]> {
    const typeName = this.typePaths.get(type);
    return this.cache$.get(typeName)
      .pipe(
        map(data => Array.from(data.values()))
      );
  }

  getContractsArray<T extends IContract>(type: new () => T): T[] {
    return Array.from(this.getContracts(type)?.values());
  }

  getContractName(address: string): string {
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
    return this.httpService.httpGetWithNetwork(`/${ this.urlPrefix }/${ this.typePaths.get(type) }`)
      .pipe(
        map((val: T[]) => val?.map(o => Object.assign(new type(), o)) as T[]),
      );
  }

}
