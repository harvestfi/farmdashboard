import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {HttpClient} from '@angular/common/http';
import {map, share} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

interface FilteredVault {
    vaultName: string;
    iconUrl: string;
    address: string;
}

@Injectable({
    providedIn: 'root'
})

export class VaultsDataService {

    constructor(
        @Inject(APP_CONFIG) public config: AppConfig,
        private http: HttpClient) {
    }

    retrieveVaultsList(): Observable<Array<FilteredVault>> {
        return this.http.get(`http://localhost:8080/harvestFinance/vaults`)
            .pipe(share())
            .pipe(map(data => (this.getFilteredArray(data))
            ));
    }

    getFilteredArray(list): Array<FilteredVault> {
        const array = [];
        for (const key in list) {
            if (list.hasOwnProperty(key) && key !== 'updatedAt') {
                array.push({
                    network: key,
                    vaults: []
                });
                for (const vault in list[key]) {
                    if (list[key].hasOwnProperty(vault)) {
                        array[array.length - 1].vaults.push({
                            vaultName: vault,
                            iconUrl: 'https://harvest.finance' + list[key][vault].logoUrl.slice(1),
                            address: list[key][vault].vaultAddress
                        });
                    }
                }
            }
        }
        return array;
    }
}
