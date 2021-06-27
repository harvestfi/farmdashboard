import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';
import {HarvestDataService} from '@data/services/data/harvest-data.service';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {HarvestDto} from '@data/models/harvest-dto';
import {Utils} from '@data/static/utils';
import {Vault} from '@data/models/vault';
import {RewardDataService} from '@data/services/data/reward-data.service';
import {PriceDataService} from '@data/services/data/price-data.service';

@Component({
  selector: 'app-apy-common',
  templateUrl: './apy-common.component.html',
  styleUrls: ['./apy-common.component.scss']
})
export class ApyCommonComponent implements OnInit {
  @Input() vault: Vault;

  constructor(private hardworkData: HardworkDataService,
              private harvestData: HarvestDataService,
              private rewardData: RewardDataService,
              private priceData: PriceDataService,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
  }

  hardwork(): HardWorkDto {
    return this.hardworkData.getLastHardWork(this.vault.contract.address, this.vault.contract.network);
  }

  harvest(): HarvestDto {
    return this.harvestData.getVaultLastInfo(this.vault.contract.address, this.vault.contract.network);
  }

  toApy(n: number): number {
    return Utils.aprToApyEveryDayReinvest(n);
  }

  get vaultRewardApr(): number {
    return this.rewardData.vaultRewardApr(this.vault.contract.address, this.vault.contract.network,
        this.harvestData.getVaultLastInfo(this.vault.contract.address, this.vault.contract.network)?.lastUsdTvl,
        this.priceData.getLastFarmPrice());
  }

  get vaultApr(): number {
    return Math.max(this.hardworkData.getWeeklyApr(this.vault.contract.address, this.vault.contract.network), 0);
  }

}
