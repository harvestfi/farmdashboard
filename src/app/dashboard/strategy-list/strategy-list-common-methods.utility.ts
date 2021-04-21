import {HarvestDataService} from 'src/app/services/data/harvest-data.service';

import {Utils} from '../../static/utils';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {RewardDataService} from '../../services/data/reward-data.service';

abstract class StrategyListCommonMethods {
  protected constructor(
      public harvestData: HarvestDataService,
      public hardworkData: HardworkDataService,
      public rewardData: RewardDataService
  ) {
  }

  vaultRewardApyPrettify(name: string, network: string): string {
    return Utils.prettifyNumber(this.rewardData.getWeeklyApy(name, network));
  }

  vaultRewardAprPrettify(tvlName: string, network: string): string {
    return Utils.prettifyNumber(this.vaultRewardApr(tvlName, network));
  }

  vaultRewardApr(vaultName: string, network: string): number {
    return this.rewardData.vaultRewardApr(vaultName, network,
        this.harvestData.getVaultLastInfo(vaultName, network)?.lastUsdTvl);
  }

  vaultFullApy(name: string, network: string): string {
    if (name === 'PS') {
      return this.vaultRewardApyPrettify(name, network);
    }
    if (Utils.isAutoStakeVault(name)) {
      return this.vaultRewardAprPrettify(name, network);
    }
    return Utils.prettifyNumber(this.vaultApy(name, network) + this.vaultRewardApy(name, network));
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
    return (this.harvestData.getVaultTvl(vault_name, network) / 1000000) || 0;
  }

  vaultTotalEarning(vaultName: string, network: string): number {
    const hw = this.hardworkData.getLastHardWork(vaultName, network);
    return (hw?.fullRewardUsdTotal * 0.7) || 0;
  }

  vaultUsers(vaultName: string, network: string): number {
    return this.harvestData.getVaultLastInfo(vaultName, network)?.ownerCount || 0;
  }

  prettyName(name: string): string {
    return Utils.prettyVaultName(name);
  }
}

export default StrategyListCommonMethods;