import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pool } from '@data/models/pool';
import { map } from 'rxjs/operators';
import { Vault } from '@data/models/vault';
import { Addresses } from '@data/static/addresses';
import { iFarmAddress } from '@data/static/ifarm-address';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'src/app.config';
import get = Reflect.get;

@Injectable({
  providedIn: 'root',
})
export class ContractsApiService {
  private url: string;
  private localApi = window.document.location.host === 'localhost:4200' ? 'http://localhost:8080' : '';
  
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private http: HttpClient,
  ) {
    this.url = get(this.config.apiEndpoints, this.config.defaultNetwork);
  }
  
  getEthereumPools(): Observable<Pool[]> {
    const ethereumOutdatedPools = new Set<string>([]);
    
    return this.http.get<{ data: Pool[] }>(`${ this.url }/contracts/pools`)
      .pipe(
        map(({ data }) => {
          return data.filter(pool => !ethereumOutdatedPools.has(pool.contract.address.toLowerCase())) ?? [];
        }),
      );
  }
  
  getEthereumVaults(): Observable<Vault[]> {
    const ethereumOutdatedVaults = new Set<string>([
      Addresses.ADDRESSES.get('PS_V0'),
    ]);
    
    return this.http.get<{ data: Vault[] }>(`${ this.url }/contracts/vaults`)
      .pipe(
        map(({ data }) => {
          data.push(iFarmAddress);
          
          return data.filter(vault => !ethereumOutdatedVaults.has(vault.contract.address.toLowerCase())) ?? [];
        }),
      );
  }
  
  getPersonalGasSaved(address: string): Observable<null | number> {
    return this.http.get<{ data: number }>(`${ this.url }/total_saved_gas_fee_by_address?address=${ address }`)
      .pipe(
        map(({ data }) => data),
      );
  }
  
  getAPY(): Observable<string | null> {
    return this.http.get<{ eth: any[] }>(`${ this.localApi }/harvestFinance/pools`)
      .pipe(
        map(({ eth }) => eth[0].rewardAPY[0] ?? null),
      );
  }
}
