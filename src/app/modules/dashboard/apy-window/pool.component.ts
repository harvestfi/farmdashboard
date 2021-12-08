import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HardworkDataService } from '@data/services/data/hardwork-data.service';
import { HarvestDataService } from '@data/services/data/harvest-data.service';
import { HardWorkDto } from '@data/models/hardwork-dto';
import { HarvestDto } from '@data/models/harvest-dto';
import { Utils } from '@data/static/utils';
import { Vault } from '@data/models/vault';
import { RewardDataService } from '@data/services/data/reward-data.service';
import { PriceDataService } from '@data/services/data/price-data.service';
import { Pool } from '@data/models/pool';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss'],
})
export class PoolComponent implements OnInit {
  @Input() vault: Vault;
  @Input() pool: Pool;

  public vaultRewardAprValue = 0;
  public vaultApyValue = 0;
  public vaultRewardWeeklyApy = 0;
  public vaultRewardPeriod = 0;
  public vaultReward = 0;

  constructor(
    private hardworkData: HardworkDataService,
    private harvestData: HarvestDataService,
    private rewardData: RewardDataService,
    private priceData: PriceDataService,
    private log: NGXLogger,
  ) {
  }

  ngOnInit(): void {
    this.vaultRewardAprValue = this.rewardData.vaultRewardApr(
      this.vault.contract.address, this.vault.contract.network,
      this.harvestData.getVaultLastInfo(this.vault.contract.address, this.vault.contract.network)?.lastUsdTvl,
      this.priceData.getLastFarmPrice(),
    );

    this.vaultApyValue = this.toApy(this.vaultRewardAprValue);

    this.vaultRewardWeeklyApy = this.rewardData.getWeeklyApy(this.vault.contract.address, this.vault.contract.network);

    this.vaultRewardPeriod = this.rewardData.getRewardPeriod(this.vault.contract.address, this.vault.contract.network);

    this.vaultReward = this.rewardData.getReward(this.vault.contract.address, this.vault.contract.network);
  }

  private hardwork(): HardWorkDto {
    return this.hardworkData.getLastHardWork(this.vault.contract.address, this.vault.contract.network);
  }

  private harvest(): HarvestDto {
    return this.harvestData.getVaultLastInfo(this.vault.contract.address, this.vault.contract.network);
  }

  private toApy(n: number): number {
    return Utils.aprToApyEveryDayReinvest(n);
  }

}
