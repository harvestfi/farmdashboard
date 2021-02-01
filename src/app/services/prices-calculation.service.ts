import {Injectable} from '@angular/core';
import {HarvestDto} from '../models/harvest-dto';
import {VaultStats} from '../models/vault-stats';
import {LpStat} from '../models/lp-stat';
import {PricesDto} from '../models/prices-dto';
import {StaticValues} from '../static/static-values';
import {HardWorkDto} from '../models/hardwork-dto';
import {RewardDto} from '../models/reward-dto';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class PricesCalculationService {
  public tvls = new Map<string, number>();
  public tvlNames = new Set<string>();
  public allTvls = 0.0;
  public vaultStats = new Map<string, VaultStats>();
  public lastHarvests = new Map<string, HarvestDto>();
  public lastHardWorks = new Map<string, HardWorkDto>();
  public lastRewards = new Map<string, RewardDto>();
  public latestHarvest: HarvestDto;
  public latestHardWork: HardWorkDto;
  private lastTvlDates = new Map<string, number>();
  private rewardEnded = new Set<string>();
  private lastPrices = new Map<string, PricesDto>();

  constructor(private log: NGXLogger) {
    StaticValues.vaults.forEach(v => this.tvls.set(v, 0.0));
  }

  private static mapCoinNameToSimple(name: string): string {
    switch (name) {
      case 'CRV_STETH':
      case 'WETH':
        return 'ETH';
      case 'RENBTC':
      case 'CRVRENWBTC':
      case 'TBTC':
      case 'WBTC':
      case 'CRV_TBTC':
      case 'CRV_HBTC':
      case 'CRV_OBTC':
        return 'BTC';
      case 'CRV_EURS':
        return 'EURS';
      case 'PS_V0':
      case 'PS':
        return 'FARM';
    }
    return name;
  }

  private static isStableCoin(name: string): boolean {
    return 'USD' === name
        || 'USDC' === name
        || 'USDT' === name
        || 'YCRV' === name
        || '3CRV' === name
        || 'TUSD' === name
        || 'DAI' === name
        || 'CRV_CMPND' === name
        || 'CRV_BUSD' === name
        || 'CRV_USDN' === name
        || 'CRV_HUSD' === name
        || 'UST_NAME' === name
        || 'CRV_UST' === name
        || 'UST' === name
        || 'EURS' === name
        || 'CRV_EURS' === name
        ;
  }

  public writeFromHarvestTx(tx: HarvestDto): void {
    if (!this.latestHarvest || this.latestHarvest.blockDate < tx.blockDate) {
      if (tx.lastGas != null && (tx.lastGas + '') !== 'NaN' && tx.lastGas !== 0) {
        StaticValues.lastGas = tx.lastGas;
      }
      this.latestHarvest = tx;
    }
    if (!tx || this.lastTvlDates.get(tx.vault) > tx.blockDate) {
      return;
    }
    if (tx.vault === 'PS') {
      StaticValues.staked = (tx.lastTvl / tx.sharePrice) * 100;
      StaticValues.farmTotalSupply = tx.sharePrice;
    }
    const vaultStats = new VaultStats();
    vaultStats.lpStat = tx.lpStatDto;
    vaultStats.tvl = tx.lastTvl;
    vaultStats.owners = tx.ownerCount;
    this.vaultStats.set(tx.vault, vaultStats);
    this.lastTvlDates.set(tx.vault, tx.blockDate);
    this.lastHarvests.set(tx.vault, tx);
  }

  public saveHardWork(tx: HardWorkDto): void {
    if (!tx || this.lastHardWorks.get(tx.vault)?.blockDate > tx.blockDate) {
      return;
    }

    if (!this.latestHardWork || this.latestHardWork.blockDate < tx.blockDate) {
      this.latestHardWork = tx;
    }

    this.lastHardWorks.set(tx.vault, tx);
  }

  public updateTvls(): void {
    let allTvls = 0.0;
    this.vaultStats.forEach((vaultStats: VaultStats, vaultName: string) => {
      // console.log('vaultName ' + vaultName, vaultStats);
      this.tvlNames.add(vaultName);
      const tvl = this.calculateTvl(vaultStats, vaultName);
      if (tvl) {
        this.tvls.set(vaultName, tvl);
        allTvls += tvl;
      }
    });
    this.allTvls = allTvls / 1000000;
    // console.log('allTvls ', this.allTvls);
  }

  saveReward(tx: RewardDto): void {
    if (!tx || this.lastRewards.get(tx.vault)?.blockDate > tx.blockDate) {
      return;
    }
    this.lastRewards.set(tx.vault, tx);
  }

  // -------------------------- GETTERS ----------------------------------
  vaultReward(tvlName: string): number {
    const reward = this.lastRewards.get(tvlName);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return reward.reward;
  }

  vaultRewardPeriod(tvlName: string): number {
    const reward = this.lastRewards.get(tvlName);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return ((reward.periodFinish - reward.blockDate) / 60 / 60 / 24);
  }

  vaultRewardWeeklyApy(tvlName: string): number {
    const reward = this.lastRewards.get(tvlName);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return reward.weeklyApy;
  }

  vaultRewardApr(poolName: string): number {
    const reward = this.lastRewards.get(poolName);
    const harvest = this.lastHarvests.get(poolName);
    if (!harvest || !reward) {
      return 0;
    }
    if ((Date.now() / 1000) > reward.periodFinish) {
      if (!this.rewardEnded.has(poolName)) {
        this.log.warn(poolName + ' reward setup zero, it is ended');
        this.rewardEnded.add(poolName);
      }
      return 0;
    }
    const period = StaticValues.SECONDS_OF_YEAR / (reward.periodFinish - reward.blockDate);
    const rewardUsd = reward.reward * StaticValues.lastPrice;
    return (rewardUsd / harvest?.lastUsdTvl) * period * 100;
  }

  psIncome(): number {
    return (this.latestHardWork?.allProfit / 0.7) * 0.3;
  }

  incomeApr(tvlName: string): number {
    const hardWork = this.lastHardWorks.get(tvlName);
    if (hardWork) {
      if ((Date.now() / 1000) - hardWork.blockDate > (StaticValues.SECONDS_OF_DAY * 14)) {
        // this.log.warn('old hw for ' + tvlName);
        return 0;
      }
      const weeklyProfit = Math.max(hardWork.weeklyProfit, 0);
      return (StaticValues.SECONDS_OF_YEAR / StaticValues.SECONDS_OF_WEEK)
          * ((weeklyProfit / hardWork?.weeklyAverageTvl) * 100.0);
    }
    return 0;
  }

  weeklyAllIncome(): number {
    return (this.latestHardWork?.weeklyAllProfit / 0.7);
  }

  lastFarmPrice(): number {
    if (StaticValues.lastPrice != null) {
      return StaticValues.lastPrice;
    }
    return 0.0;
  }

  lastAllUsersCount(): number {
    if (!this.latestHarvest || !this.latestHarvest.allOwnersCount) {
      return 0;
    }
    return this.latestHarvest?.allOwnersCount;
  }

  lastPoolsActiveUsersCount(): number {
    if (!this.latestHarvest || !this.latestHarvest.allPoolsOwnersCount) {
      return 0;
    }
    return this.latestHarvest?.allPoolsOwnersCount;
  }

  savedGasFees(): number {
    let fees = 0;
    for (const hw of this.lastHardWorks.values()) {
      if (hw.savedGasFeesSum) {
        fees += hw.savedGasFeesSum;
      }
    }
    return fees;
  }

  farmPsStaked(): number {
    return StaticValues.staked;
  }

  farmLpStaked(): number {
    let farmInLp = 0;
    let lpStaked = 0;
    for (const name of StaticValues.farmPools) {
      const harvest = this.lastHarvests.get(name);
      if (!harvest) {
        continue;
      }
      if (harvest.lpStatDto.coin1 === 'FARM') {
        farmInLp += harvest.lpStatDto.amount1;
      }
      if (harvest.lpStatDto.coin2 === 'FARM') {
        farmInLp += harvest.lpStatDto.amount2;
      }
    }
    if (farmInLp !== 0) {
      lpStaked = (farmInLp / StaticValues.farmTotalSupply) * 100;
    }
    return lpStaked;
  }

  public getPrice(name: string): number {
    name = PricesCalculationService.mapCoinNameToSimple(name);
    if (PricesCalculationService.isStableCoin(name)) {
      return 1.0;
    }
    if (name === 'FARM') {
      return this.lastFarmPrice();
    }
    if (!this.lastPrices.has(name)) {
      return 0;
    }
    const usdPrice = this.getPrice(this.lastPrices.get(name).otherToken);
    return this.lastPrices.get(name).price * usdPrice;
  }

  private calculateTvlForLp(lpStat: LpStat): number {
    const simpleName1 = PricesCalculationService.mapCoinNameToSimple(lpStat.coin1);
    const simpleName2 = PricesCalculationService.mapCoinNameToSimple(lpStat.coin2);
    const price1 = this.getPrice(simpleName1);
    const price2 = this.getPrice(simpleName2);
    const amount1 = price1 * lpStat.amount1;
    const amount2 = price2 * lpStat.amount2;
    // console.log('calculateTvlForLp ', simpleName1, simpleName2, price1, price2, amount1, amount2);
    return amount1 + amount2;
  }

  private calculateTvl(vaultStats: VaultStats, name: string): number {
    if (name === 'PS') {
      return vaultStats.tvl * StaticValues.lastPrice;
    } else if (vaultStats.lpStat) {
      return this.calculateTvlForLp(vaultStats.lpStat);
    } else if (vaultStats.tvl) {
      const price = this.getPrice(name);
      if (price === 0) {
        console.log('not found price for ' + name);
      }
      return vaultStats.tvl * price;
    }
    return 0.0;
  }

  public savePrice(tx: PricesDto): void {
    const name = PricesCalculationService.mapCoinNameToSimple(tx.token);
    if (this.lastPrices.has(name) && this.lastPrices.get(name).block > tx.block) {
      this.log.warn('Loaded old price!', tx);
      return;
    }
    this.lastPrices.set(name, tx);
  }
}
