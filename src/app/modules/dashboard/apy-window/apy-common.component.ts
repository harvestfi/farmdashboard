import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HardworkDataService } from '@data/services/data/hardwork-data.service';
import { HarvestDataService } from '@data/services/data/harvest-data.service';
import { HardWorkDto } from '@data/models/hardwork-dto';
import { HarvestDto } from '@data/models/harvest-dto';
import { Utils } from '@data/static/utils';
import { Vault } from '@data/models/vault';
import { RewardDataService } from '@data/services/data/reward-data.service';
import { PriceDataService } from '@data/services/data/price-data.service';

@Component({
  selector: 'app-apy-common',
  templateUrl: './apy-common.component.html',
  styleUrls: ['./apy-common.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApyCommonComponent implements OnInit {
  @Input() vault: Vault;

  public totalAPR = 0;
  public totalAPY = 0;

  constructor(
    private hardworkData: HardworkDataService,
    private harvestData: HarvestDataService,
    private rewardData: RewardDataService,
    private priceData: PriceDataService,
    private log: NGXLogger,
  ) {
  }

  ngOnInit(): void {
    const vaultRewardAprValue = this.rewardData.vaultRewardApr(
      this.vault.contract.address,
      this.vault.contract.network,
      this.harvestData.getVaultLastInfo(this.vault.contract.address, this.vault.contract.network)?.lastUsdTvl,
      this.priceData.getLastFarmPrice(),
    );

    const vaultAprValue = Math.max(
      this.hardworkData.getWeeklyApr(this.vault.contract.address, this.vault.contract.network),
      0,
    );

    this.totalAPR = vaultRewardAprValue + vaultAprValue;
    this.totalAPY = this.toApy(vaultRewardAprValue) + this.toApy(vaultAprValue);
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
