import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IncomeDialogComponent} from '../../dialogs/income-dialog/income-dialog.component';
import {TvlDialogComponent} from '../../dialogs/tvl-dialog/tvl-dialog.component';
import {HardWorkDto} from '../../models/hardwork-dto';
import {Utils} from '../../utils';
import {StaticValues} from '../../static-values';
import {RewardsDialogComponent} from '../../dialogs/rewards-dialog/rewards-dialog.component';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {ViewTypeService} from '../../services/view-type.service';
import {MatDialog} from '@angular/material/dialog';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.css']
})
export class ApyWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() poolName: string;

  constructor(private pricesCalculationService: PricesCalculationService,
              private dialog: MatDialog,
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
    if (Utils.isAutoStakeVault(this.poolName)) {
      this.openPsApyDialog();
      return;
    }
    this.dialog.open(IncomeDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: this.poolName + ' Income history chart',
        name: this.poolName
      }
    });
  }

  private openPsApyDialog(): void {
    if (this.poolName !== 'PS') {
      return;
    }
    this.dialog.open(RewardsDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'PS APY History',
        name: ''
      }
    });
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
    // todo change on profit
    return this.pricesCalculationService.lastHardWorks.get(this.poolName)?.shareUsdTotal;
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
