import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Utils} from '../../static/utils';
import {NGXLogger} from 'ngx-logger';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Vault} from '../../models/vault';
import {HarvestDto} from '../../models/harvest-dto';

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.scss']
})
export class ApyWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() vault: Vault;
  @ViewChild('incomeModal') private incomeModal: CustomModalComponent;
  @ViewChild('psApyModal') private psApyModal: CustomModalComponent;

  constructor(private hardworkData: HardworkDataService,
              private harvestData: HarvestDataService,
              private rewardData: RewardDataService,
              private priceData: PriceDataService,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
  }

  hardwork(): HardWorkDto {
    return this.hardworkData.getLastHardWork(this.vault.contract.name, this.vault.contract.network);
  }

  harvest(): HarvestDto {
    return this.harvestData.getVaultLastInfo(this.vault.contract.name, this.vault.contract.network);
  }

  closeModal(): void {
    this.showModal.emit(false);
  }

  toApy(n: number): number {
    return Utils.aprToApyEveryDayReinvest(n);
  }

  // ------------------- DIALOGS --------------------

  openIncomeDialog(): void {
    if (this.vault.contract.name === 'PS') {
      this.openPsApyDialog();
      return;
    }
    this.incomeModal.open();
  }

  private openPsApyDialog(): void {
    if (this.vault.contract.name !== 'PS') {
      return;
    }
    this.psApyModal.open();
  }

  // ---------------- GETTERS --------------------

  get isAutoStakeVault(): boolean {
    const hw = this.hardworkData.getLastHardWork(this.vault.contract.name, this.vault.contract.network);
    if(hw?.autoStake === 1) {
      return true;
    }
    return Utils.isAutoStakeVault(this.vault.contract.name);
  }

  get isFarmVault(): boolean {
    return Utils.isFarmVault(this.vault.contract.name);
  }

  // ********* PS *************

  get psIncome(): number {
    return (this.hardwork()?.allProfit / 0.7) * 0.3;
  }

  get psApr(): number {
    return this.hardwork()?.psApr;
  }

  // ********* VAULT *************
  get sharePrice(): number {
    return this.harvest().sharePrice;
  };

  get vaultEarned(): number {
    return this.hardwork()?.fullRewardUsdTotal * (1 - this.hardwork()?.profitSharingRate);
  }

  get vaultEarnedLastWeek(): number {
    return this.hardwork()?.weeklyProfit * (1 - this.hardwork()?.profitSharingRate);
  }

  get vaultAvgTvl(): number {
    let avgTvl = this.hardwork()?.weeklyAverageTvl;
    if (!avgTvl || avgTvl === 0) {
      avgTvl = this.hardwork()?.tvl;
    }
    return avgTvl;
  }

  get vaultPeriodOfWork(): number {
    return this.hardwork()?.periodOfWork
        / (60 * 60 * 24);
  }

  get vaultApr(): number {
    return Math.max(this.hardworkData.getWeeklyApr(this.vault.contract.name, this.vault.contract.network), 0);
  }

  get vaultRewardPeriod(): number {
    return this.rewardData.getRewardPeriod(this.vault.contract.name, this.vault.contract.network);
  }

  get vaultReward(): number {
    return this.rewardData.getReward(this.vault.contract.name, this.vault.contract.network);
  }

  get vaultRewardApr(): number {
    return this.rewardData.vaultRewardApr(this.vault.contract.name, this.vault.contract.network,
        this.harvestData.getVaultLastInfo(this.vault.contract.name, this.vault.contract.network)?.lastUsdTvl,
        this.priceData.getLastFarmPrice());
  }

  get vaultRewardWeeklyApy(): number {
    return this.rewardData.getWeeklyApy(this.vault.contract.name, this.vault.contract.network);
  }

  viewNetworkAddress(contractLike: {network:string, address: string}) {
      if (contractLike.network === 'bsc') {
      window.open('https://www.bscscan.com/address/' + contractLike.address, '_blank');
    } else {
      window.open('https://etherscan.io/address/' + contractLike.address, '_blank');
    }
  }
}
