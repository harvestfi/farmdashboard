import {Pipe, PipeTransform} from '@angular/core';
import {HarvestDataService} from 'src/app/services/data/harvest-data.service';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Contract} from '../../models/contract';

@Pipe({
  name: 'strategyListFilter',
})
export class StrategyListFilterPipe extends StrategyListCommonMethods implements PipeTransform {
  constructor(
      public harvestData: HarvestDataService,
      public hardworkData: HardworkDataService,
      public rewardData: RewardDataService,
      public priceData: PriceDataService
  ) {
    super(harvestData, hardworkData, rewardData, priceData);
    }

    transform(
        vaults: Contract[],
        network: string,
        platform: string,
        asset: string,
        currentSortingValue: string,
        sortDirection: string,
        searchTerm: string
        ): Contract[] {

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
                if (left.name < right.name) {
                  return -1;
                }
                return 1;
              case 'apy':
                return Number(this.vaultFullApy(right.name, right.network)) - Number(this.vaultFullApy(left.name, left.network));
              case 'tvl':
                return this.vaultTvl(right.name, right.network) - this.vaultTvl(left.name, left.network);
              case 'users':
                return this.vaultUsers(right.name, right.network) - this.vaultUsers(left.name, left.network);
              case 'total_earned':
                return this.vaultTotalEarning(right.name, right.network) - this.vaultTotalEarning(left.name, left.network);
              default:
                break;
            }
          });

        return newVaults;
    }
}
