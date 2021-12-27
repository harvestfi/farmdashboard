import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pool } from '@data/models/pool';
import { map } from 'rxjs/operators';
import { Vault } from '@data/models/vault';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'src/app.config';
import get = Reflect.get;

@Injectable({
  providedIn: 'root',
})
export class BscApiService {
  private url: string;
  private localApi = window.document.location.host === 'localhost:4200' ? 'http://localhost:8080' : '';
  
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private http: HttpClient,
  ) {
    this.url = get(this.config.apiEndpoints, this.config.defaultNetwork);
  }
  
  getBscPools(): Observable<Pool[]> {
    const ethereumOutdatedPools = new Set<string>([]);
    
    return this.http.get<{ data: Pool[] }>(`${ this.url }/contracts/pools?network=bsc`)
      .pipe(
        map(({ data }) => {
          return data.filter(pool => !ethereumOutdatedPools.has(pool.contract.address.toLowerCase())) ?? [];
        }),
      );
  }
  
  getBscVaults(): Observable<Vault[]> {
    const ethereumOutdatedVaults = new Set<string>([]);
    
    return this.http.get<{ data: Vault[] }>(`${ this.url }/contracts/vaults?network=bsc`)
      .pipe(
        map(({ data }) => {
          return data.filter(vault => !ethereumOutdatedVaults.has(vault.contract.address.toLowerCase())) ?? [];
        }),
      );
  }
}
