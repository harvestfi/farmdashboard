import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { map, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface FilteredVault {
  vaultName: string;
  iconUrl: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})

export class VaultsDataService {

    localApi = window.document.location.host === 'localhost:4200' ? 'http://localhost:8080' : '';
    constructor(
        @Inject(APP_CONFIG) public config: AppConfig,
        private http: HttpClient,
    ) {
    }

    retrieveVaultsList(): Observable<Array<FilteredVault>> {
        return this.http.get(`${this.localApi}/harvestFinance/vaults`)
            .pipe(
                share(),
                map(data => (this.getFilteredArray(data)),
            ));
    }

  getFilteredArray(list): Array<FilteredVault> {
    const array = [];
    Object.keys(list)
      .filter(network => network !== 'updatedAt')
      .forEach(network => {
        array.push({
          network,
          vaults: [],
        });


        const listValue = list[network];

        Object.keys(listValue)
          .forEach(vault => {
            const listValueVault = listValue[vault];

            array[array.length - 1].vaults.push({
              vaultName: vault,
              iconUrl: 'https://harvest.finance' + listValueVault.logoUrl.slice(1),
              address: listValueVault.vaultAddress,
            });
          });
      });
    return array;
  }
}
