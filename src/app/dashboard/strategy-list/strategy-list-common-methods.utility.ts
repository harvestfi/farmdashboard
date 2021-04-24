import {HarvestDataService} from 'src/app/services/data/harvest-data.service';

import {Utils} from '../../static/utils';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';

abstract class StrategyListCommonMethods {
  protected constructor(
      public harvestData: HarvestDataService,
      public hardworkData: HardworkDataService,
      public rewardData: RewardDataService,
      public priceData: PriceDataService
  ) {
  }

  prettifyNumber(n: number): string {
    return Utils.prettifyNumber(n);
  }

  vaultRewardApr(vaultName: string, network: string): number {
    return this.rewardData.vaultRewardApr(vaultName, network,
        this.harvestData.getVaultLastInfo(vaultName, network)?.lastUsdTvl,
        this.priceData.getLastFarmPrice());
  }

  vaultFullApy(name: string, network: string): number {
    if (name === 'PS') {
      return this.vaultRewardApy(name, network);
    }
    if (Utils.isAutoStakeVault(name) || this.hardworkData.getLastHardWork(name, network)?.autoStake === 1) {
      return this.vaultRewardApy(name, network);
    }
    return this.vaultApy(name, network) + this.vaultRewardApy(name, network);
  }

  vaultApy(tvlName: string, network: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultApr(tvlName, network));
  }

  vaultApr(tvlName: string, network: string): number {
    return Math.max(this.hardworkData.getWeeklyApr(tvlName, network), 0);
  }

  vaultRewardApy(tvlName: string, network: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName, network));
  }

  vaultTvl(vault_name: string, network: string): number {
    const tvl = this.harvestData.getVaultTvl(vault_name, network, this.priceData);
    return (tvl) || 0;
  }

  vaultTotalEarning(vaultName: string, network: string): number {
    const hw = this.hardworkData.getLastHardWork(vaultName, network);
    return (hw?.fullRewardUsdTotal * (1 - hw?.profitSharingRate)) || 0;
  }

  vaultUsers(vaultName: string, network: string): number {
    return this.harvestData.getVaultLastInfo(vaultName, network)?.ownerCount || 0;
  }

  prettyName(name: string): string {
    return Utils.prettyVaultName(name);
  }
}

export default StrategyListCommonMethods;
