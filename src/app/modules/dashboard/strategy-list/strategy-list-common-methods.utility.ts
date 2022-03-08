import { HarvestDataService } from '@data/services/data/harvest-data.service';
import { Utils } from '@data/static/utils';
import { HardworkDataService } from '@data/services/data/hardwork-data.service';
import { RewardDataService } from '@data/services/data/reward-data.service';
import { PriceDataService } from '@data/services/data/price-data.service';
import { Addresses } from '@data/static/addresses';

abstract class StrategyListCommonMethods {
  protected constructor(
    public harvestData: HarvestDataService,
    public hardworkData: HardworkDataService,
    public rewardData: RewardDataService,
    public priceData: PriceDataService,
  ) {
  }
  
  prettifyNumber(n: number): string {
    return Utils.prettifyNumber(n);
  }
  
  vaultRewardApr(vaultAddress: string, network: string): number {
    return this.rewardData.vaultRewardApr(vaultAddress, network,
      this.harvestData.getVaultLastInfo(vaultAddress, network)?.lastUsdTvl,
      this.priceData.getLastFarmPrice());
  }
  
  vaultFullApy(address: string, network: string): number {
    if (address === Addresses.ADDRESSES.get('PS')) {
      return this.vaultRewardApy(address, network);
    }
    const lastHw = this.hardworkData.getLastHardWork(address, network);
    if (lastHw?.autoStake === 1 || lastHw?.autoStake === 1) {
      return this.vaultRewardApy(address, network);
    }
    return this.vaultApy(address, network) + this.vaultRewardApy(address, network);
  }
  
  vaultApy(vaultAddress: string, network: string): number {
    // return Utils.aprToApyEveryDayReinvest(this.vaultApr(vaultAddress, network));
    return Math.max(this.hardworkData.getRoiBasedOnPPFS(vaultAddress, network), 0);
  }
  
  vaultApr(vaultAddress: string, network: string): number {
    return Math.max(this.hardworkData.getWeeklyApr(vaultAddress, network), 0);
  }
  
  vaultRewardApy(vaultAddress: string, network: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(vaultAddress, network));
  }
  
  vaultTvl(vaultAddress: string, network: string): number {
    const tvl = this.harvestData.getVaultTvl(vaultAddress, network, this.priceData);
    return (tvl) || 0;
  }
  
  vaultTotalEarning(vaultAddress: string, network: string): number {
    const hw = this.hardworkData.getLastHardWork(vaultAddress, network);
    return (hw?.fullRewardUsdTotal * (1 - hw?.profitSharingRate)) || 0;
  }
  
  vaultUsers(vaultAddress: string, network: string): number {
    return this.harvestData.getVaultLastInfo(vaultAddress, network)?.ownerCount || 0;
  }
}

export default StrategyListCommonMethods;
