import {Injectable} from '@angular/core';
import {RewardDto} from '../../models/reward-dto';
import {StaticValues} from '../../static/static-values';
import {RewardsService} from '../http/rewards.service';
import {NGXLogger} from 'ngx-logger';
import {ContractsService} from '../contracts.service';
import {Vault} from '../../models/vault';

@Injectable({
  providedIn: 'root'
})
export class RewardDataService {

  private lastRewards = new Map<string, Map<string, RewardDto>>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );
  private rewardEnded = new Set<string>();

  constructor(
      private rewardService: RewardsService,
      private contractService: ContractsService,
      private log: NGXLogger
  ) {
    this.load();
  }

  private load(): void {
    this.rewardService.getLastRewards().subscribe(data => {
          this.log.info('All last rewards loaded', data);
          return data?.forEach(this.handle.bind(this));
        }
    );
    this.rewardService.subscribeToRewards().subscribe(this.handle.bind(this));
  }

  private handle(dto: RewardDto): void {
    RewardDto.enrich(dto);
    if (!dto.network || dto.network === '') {
      this.log.warn('Empty network', dto);
      return;
    }
    if (this.isNotActual(dto)) {
      this.log.warn('Old vault info', dto);
      return;
    }
    this.lastRewards.get(dto.network).set(dto.vaultAddress, dto);
  }

  private isNotActual(dto: RewardDto): boolean {
    return !dto
        || this.lastRewards.get(dto.network)?.get(dto.vaultAddress)?.blockDate > dto.blockDate;
  }

  public getLastReward(address: string, network: string): RewardDto {
    return this.lastRewards.get(network).get(address);
  }

  public getRewardPeriod(address: string, network: string): number {
    const reward = this.lastRewards.get(network).get(address);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return ((reward.periodFinish - reward.blockDate) / 60 / 60 / 24);
  }

  public getReward(address: string, network: string): number {
    const reward = this.lastRewards.get(network).get(address);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return reward.reward;
  }

  public getWeeklyApy(address: string, network: string): number {
    const reward = this.lastRewards.get(network).get(address);
    if (!reward || (Date.now() / 1000) > reward.periodFinish) {
      return 0;
    }
    return reward.weeklyApy;
  }

  vaultRewardApr(vaultAddress: string, network: string, usdTvl: number, farmPrice: number): number {
    const reward = this.lastRewards.get(network).get(vaultAddress);
    if (!reward || !usdTvl || usdTvl === 0) {
      if (!this.rewardEnded.has(vaultAddress)) {
        this.log.warn(this.contractService.getContracts(Vault).get(vaultAddress)?.name
            + ' not found rewards');
        this.rewardEnded.add(vaultAddress);
      }
      return 0;
    }
    if ((Date.now() / 1000) > reward.periodFinish && !StaticValues.isPS.has(vaultAddress)) {
      if (!this.rewardEnded.has(vaultAddress)) {
        this.log.warn(this.contractService.getContracts(Vault).get(vaultAddress)?.name
            + ' reward setup zero, it is ended');
        this.rewardEnded.add(vaultAddress);
      }
      return 0;
    }
    const period = StaticValues.SECONDS_OF_YEAR / (reward.periodFinish - reward.blockDate);
    const rewardUsd = reward.reward * farmPrice;
    return (rewardUsd / usdTvl) * period * 100;
  }
}
