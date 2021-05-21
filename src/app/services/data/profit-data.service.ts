import {Injectable} from '@angular/core';
import {HarvestDataService} from './harvest-data.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ProfitDataService {

  constructor(
      private harvestData: HarvestDataService,
      private log: NGXLogger
  ) {
  }

  // vaultRewardApr(poolName: string): number {
  //   const reward = this.lastRewards.get(poolName);
  //   const harvest = this.lastHarvests.get(poolName);
  //   if (!harvest || !reward) {
  //     return 0;
  //   }
  //   if ((Date.now() / 1000) > reward.periodFinish && !StaticValues.isPS.has(poolName)) {
  //     if (!this.rewardEnded.has(poolName)) {
  //       this.log.warn(poolName + ' reward setup zero, it is ended');
  //       this.rewardEnded.add(poolName);
  //     }
  //     return 0;
  //   }
  //   const period = StaticValues.SECONDS_OF_YEAR / (reward.periodFinish - reward.blockDate);
  //   const rewardUsd = reward.reward * StaticValues.lastPrice;
  //   return (rewardUsd / harvest?.lastUsdTvl) * period * 100;
  // }
}
