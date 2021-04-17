import {Pipe, PipeTransform} from '@angular/core';
import {PricesCalculationService} from 'src/app/services/prices-calculation.service';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
@Pipe({
    name: 'strategyListFilter',
})
export class StrategyListFilterPipe extends StrategyListCommonMethods implements PipeTransform {
    constructor(
        public pricesCalculationService: PricesCalculationService
    ) {
        super(pricesCalculationService);
    }

    transform(
        vaults: any[],
        network: string,
        platform: string,
        asset: string,
        currentSortingValue: string,
        sortDirection: string,
        searchTerm: string
        ): any {

        const newVaults = vaults.filter(vault => {
            const networkMatchesFilter = (network ? vault.network === network : true);
            const platformMatchesFilter = (platform ? vault.name.startsWith(platform) : true);
            const assetMatchesFilter = (asset ? vault.name.includes(asset) : true);
            const searchTermMatchesFilter = (
                searchTerm.length ? vault.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()): true);
            if (networkMatchesFilter && platformMatchesFilter && assetMatchesFilter && searchTermMatchesFilter) {
                return vault;
            }
        });

        newVaults.sort((a: any, b: any): number => {
            const left = sortDirection === 'desc'  ? a : b;
            const right = sortDirection === 'asc' ? a : b;
            switch (currentSortingValue) {
              case 'name':
                console.log(left.name, right.name);
                if (left.name < right.name) {
                  return -1;
                }
                return 1;
              case 'apy':
                return  Number(this.vaultFullApy(right.name)) - Number(this.vaultFullApy(left.name));
              case 'tvl':
                return this.vaultTvl(right.name) - this.vaultTvl(left.name);
              case 'users':
                return this.vaultUsers(right.name) - this.vaultUsers(left.name);
              case 'total_earned':
                return this.vaultTotalEarning(right.name) - this.vaultTotalEarning(left.name);
              default:
                break;
            }
          });

        return newVaults;
    }
}
