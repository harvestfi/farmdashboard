import {HarvestDataService} from 'src/app/services/data/harvest-data.service';
import {PricesCalculationService} from 'src/app/services/prices-calculation.service';

import {Utils} from '../../static/utils';

abstract class StrategyListCommonMethods {
  constructor(
      public pricesCalculationService: PricesCalculationService,
      public harvestDataService: HarvestDataService
  ) {
  }

  vaultRewardApyPrettify(tvlName: string): string {
    return Utils.prettifyNumber(this.pricesCalculationService.vaultRewardWeeklyApy(tvlName));
  }

  vaultRewardAprPrettify(tvlName: string): string {
    return Utils.prettifyNumber(this.vaultRewardApr(tvlName));
  }

  vaultRewardApr(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardApr(tvlName);
  }

  vaultFullApy(name: string): string {
    if (name === 'PS') {
      return this.vaultRewardApyPrettify(name);
    }
    if (Utils.isAutoStakeVault(name)) {
      return this.vaultRewardAprPrettify(name);
    }
    return Utils.prettifyNumber(this.vaultApy(name) + this.vaultRewardApy(name));
  }

  vaultApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultApr(tvlName));
  }

  vaultApr(tvlName: string): number {
    return Math.max(this.pricesCalculationService.incomeApr(tvlName), 0);
  }

  vaultRewardApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName));
  }

  vaultTvl(vault_name: string, network: string): number {
    return (this.harvestDataService.getVaultTvl(vault_name, network) / 1000000) || 0;
  }

  vaultTotalEarning(tvlName: string): number {
    return (this.pricesCalculationService.lastHardWorks.get(tvlName)?.fullRewardUsdTotal * 0.7) || 0;
  }

  vaultUsers(tvlName: string): number {
    return this.pricesCalculationService.lastHarvests.get(tvlName)?.ownerCount || 0;
  }

  prettyName(name: string): string {
    return Utils.prettyVaultName(name);
  }
}

export default StrategyListCommonMethods;
