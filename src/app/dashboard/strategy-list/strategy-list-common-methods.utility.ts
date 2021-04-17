import { PricesCalculationService } from 'src/app/services/prices-calculation.service';
import {Utils} from '../../static/utils';

abstract class StrategyListCommonMethods {
    constructor(
        public pricesCalculationService: PricesCalculationService
    ){}

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

    vaultTvl(tvlName: string): number {
    return this.pricesCalculationService.tvls.get(tvlName) / 1000000;
    }

    vaultTotalEarning(tvlName: string): number {
    return (this.pricesCalculationService.lastHardWorks.get(tvlName)?.fullRewardUsdTotal * 0.7) || 0;
    }

    vaultUsers(tvlName: string): number {
    return this.pricesCalculationService.lastHarvests.get(tvlName)?.ownerCount || 0;
    }
}

export default StrategyListCommonMethods;
