import {Pipe, PipeTransform} from '@angular/core';
import {HarvestDataService} from '@data/services/data/harvest-data.service';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';
import {RewardDataService} from '@data/services/data/reward-data.service';
import {PriceDataService} from '@data/services/data/price-data.service';
import {Vault} from '@data/models/vault';

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
      searchTerm: string,
      isShowInactive: boolean,
  ): Vault[] {
    if (!vaults) {
      return [];
    }

    const newVaults = vaults
      .filter(vault => {
        const networkMatchesFilter = (network ? vault.contract?.network === network : true);
        const platformMatchesFilter = (platform ? vault.contract?.name.startsWith(platform) : true);
        const assetMatchesFilter = (asset ? vault.contract?.name.includes(asset) : true);
        const searchTermMatchesFilter = (
          searchTerm.length ? vault.contract?.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) : true);
        const hasAddress = vault.contract?.address;
        return networkMatchesFilter && platformMatchesFilter && assetMatchesFilter && searchTermMatchesFilter && hasAddress;
      })
      .map(vault => {
        const totalTVL = this.vaultTvl(vault.contract.address, vault.contract.network);
        const totalEarning = this.vaultTotalEarning(vault.contract.address, vault.contract.network);
        return {
          ...vault,
          totalTVL,
          totalTVLPrettify: this.prettifyNumber(totalTVL),
          totalEarning,
        };
      })
      .filter(vault => (vault.totalTVL === 0 && vault.totalEarning === 0 && isShowInactive) || vault.totalTVL > 0);

    newVaults.sort((a: any, b: any): number => {
      const left = sortDirection === 'desc' ? a : b;
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
          return right.totalTVL - left.totalTVL;
        case 'users':
          return this.vaultUsers(right.contract?.address, right.contract?.network)
              - this.vaultUsers(left.contract?.address, left.contract?.network);
        case 'total_earned':
          return right.totalEarning - left.totalEarning;
        case 'created':
          return left.contract?.createdDate < right.contract?.createdDate ? -1 : 1;
        default:
          break;
      }
    });

    return newVaults;
  }
}
