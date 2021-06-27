import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';
import {HarvestDataService} from '@data/services/data/harvest-data.service';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {Vault} from '@data/models/vault';
import {HarvestDto} from '@data/models/harvest-dto';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
  @Input() vault: Vault;

  constructor(private hardworkData: HardworkDataService,
              private harvestData: HarvestDataService,
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

  // ********* VAULT *************
  get sharePrice(): number {
    return this.harvest()?.sharePrice;
  }

  get currentTvl(): number {
    return this.harvest()?.lastUsdTvl;
  }

  get vaultAvgTvl(): number {
    let avgTvl = this.hardwork()?.weeklyAverageTvl;
    if (!avgTvl || avgTvl === 0) {
      avgTvl = this.currentTvl;
    }
    return avgTvl;
  }

}
