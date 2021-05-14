import {Pipe, PipeTransform} from '@angular/core';
import {HarvestDataService} from 'src/app/services/data/harvest-data.service';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Contract} from '../../models/contract';
import {Vault} from '../../models/vault';

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
        vaults: Vault[],
        network: string,
        platform: string,
        asset: string,
        currentSortingValue: string,
        sortDirection: string,
        searchTerm: string
        ): Vault[] {

        const newVaults = vaults.filter(vault => {
            const networkMatchesFilter = (network ? vault.contract?.network === network : true);
            const platformMatchesFilter = (platform ? vault.contract?.name.startsWith(platform) : true);
            const assetMatchesFilter = (asset ? vault.contract?.name.includes(asset) : true);
            const searchTermMatchesFilter = (
                searchTerm.length ? vault.contract?.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()): true);
            return networkMatchesFilter && platformMatchesFilter && assetMatchesFilter && searchTermMatchesFilter;
        });

        newVaults.sort((a: any, b: any): number => {
            const left = sortDirection === 'desc'  ? a : b;
            const right = sortDirection === 'asc' ? a : b;
            switch (currentSortingValue) {
              case 'name':
                if (left.contract?.name < right.contract?.name) {
                  return -1;
                }
                return 1;
              case 'apy':
                return this.vaultFullApy(right.contract?.address, right.contract?.network)
                    - this.vaultFullApy(left.contract?.address, left.contract?.network);
              case 'tvl':
                return this.vaultTvl(right.contract?.address, right.contract?.network)
                    - this.vaultTvl(left.contract?.address, left.contract?.network);
              case 'users':
                return this.vaultUsers(right.contract?.address, right.contract?.network)
                    - this.vaultUsers(left.contract?.address, left.contract?.network);
              case 'total_earned':
                return this.vaultTotalEarning(right.contract?.address, right.contract?.network)
                    - this.vaultTotalEarning(left.contract?.address, left.contract?.network);
              default:
                break;
            }
          });

        return newVaults;
    }
}
