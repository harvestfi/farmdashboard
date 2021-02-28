import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Utils} from '../../static/utils';
import {StaticValues} from '../../static/static-values';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {NGXLogger} from 'ngx-logger';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.css']
})
export class ApyWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() poolName: string;
  @ViewChild('incomeModal') private incomeModal: CustomModalComponent;
  @ViewChild('psApyModal') private psApyModal: CustomModalComponent;

  constructor(private pricesCalculationService: PricesCalculationService,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
    this.log.info(this.poolName,
        this.pricesCalculationService.lastHardWorks.get(this.poolName),
        this.pricesCalculationService.lastRewards.get(this.poolName),
        this.pricesCalculationService.lastHarvests.get(this.poolName)
    );
  }

  closeModal(): void {
    this.showModal.emit(false);
  }

  prettyNumber(n: number): string {
    return Utils.prettifyNumber(n);
  }

  toApy(n: number): number {
    return Utils.aprToApyEveryDayReinvest(n);
  }

  // ------------------- DIALOGS --------------------

  openIncomeDialog(): void {
    if (this.poolName === 'PS') {
      this.openPsApyDialog();
      return;
    }
    this.incomeModal.open();
  }

  private openPsApyDialog(): void {
    if (this.poolName !== 'PS') {
      return;
    }
    this.psApyModal.open();
  }

  // ---------------- GETTERS --------------------

  getImgSrc(): string {
    return StaticValues.getImgSrcForVault(this.poolName);
  }

  get isAutoStakeVault(): boolean {
    return Utils.isAutoStakeVault(this.poolName);
  }

  get isFarmVault(): boolean {
    return Utils.isFarmVault(this.poolName);
  }

  // ********* PS *************

  get psIncome(): number {
    return this.pricesCalculationService.psIncome();
  }

  get psApr(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  // ********* POOL *************

  get poolEarned(): number {
    return this.pricesCalculationService.lastHardWorks.get(this.poolName)?.fullRewardUsdTotal * 0.7;
  }

  get poolEarnedLastWeek(): number {
    return this.pricesCalculationService.lastHardWorks.get(this.poolName)?.weeklyProfit;
  }

  get poolAvgTvl(): number {
    return this.pricesCalculationService.lastHardWorks.get(this.poolName)?.weeklyAverageTvl;
  }

  get poolPeriodOfWork(): number {
    return this.pricesCalculationService.lastHardWorks.get(this.poolName)?.periodOfWork
        / (60 * 60 * 24);
  }

  get poolApr(): number {
    return Math.max(this.pricesCalculationService.incomeApr(this.poolName), 0);
  }

  get poolRewardPeriod(): number {
    return this.pricesCalculationService.vaultRewardPeriod(this.poolName);
  }

  get poolReward(): number {
    return this.pricesCalculationService.vaultReward(this.poolName);
  }

  get poolRewardApr(): number {
    return this.pricesCalculationService.vaultRewardApr(this.poolName);
  }

  get poolRewardWeeklyApy(): number {
    return this.pricesCalculationService.vaultRewardWeeklyApy(this.poolName);
  }

}
