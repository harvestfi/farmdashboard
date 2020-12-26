import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TvlDialogComponent} from '../../dialogs/tvl-dialog/tvl-dialog.component';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {StaticValues} from '../../static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {HttpService} from '../../services/http.service';
import {ProfitDialogComponent} from '../../dialogs/profit-dialog/profit-dialog.component';
import {FarmBuybacksDialogComponent} from '../../dialogs/farm-buybacks-dialog/farm-buybacks-dialog.component';
import {HardWorkHistoryDialogComponent} from "../../dialogs/hard-work-history-dialog/hard-work-history-dialog.component";
import {TotalUsersDialogComponent} from "../../dialogs/total-users-dialog/total-users-dialog.component";

export interface TvlDialogData {
  type: string;
}

export interface DialogData {
  title: string;
  name: string;
}

@Component({
  selector: 'app-dashboard-last-values',
  templateUrl: './dashboard-last-values.component.html',
  styleUrls: ['./dashboard-last-values.component.css']
})
export class DashboardLastValuesComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public vt: ViewTypeService,
              private api: HttpService,
              private pricesCalculationService: PricesCalculationService) {
  }

  get lastGasF(): number {
    if (StaticValues.lastGas != null) {
      return StaticValues.lastGas;
    }
    return 0;
  }

  get lastPriceF(): number {
    return this.pricesCalculationService.lastFarmPrice();
  }

  get allTvlF(): number {
    return this.pricesCalculationService.allTvls;
  }

  get btcF(): number {
    return this.pricesCalculationService.btc;
  }

  get ethF(): number {
    return this.pricesCalculationService.eth;
  }

  get staked(): number {
    return StaticValues.staked;
  }

  get mCap(): number {
    return (StaticValues.farmTotalSupply * StaticValues.lastPrice) / 1000000;
  }

  get weeklyAllIncome(): number {
    return this.pricesCalculationService.weeklyAllIncome();
  }

  get psApy(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  get farmBuybacks(): number {
    return this.pricesCalculationService.latestHardWork?.farmBuybackSum / 1000;
  }

  get allUsersCount(): number {
    return this.pricesCalculationService.lastAllUsersCount();
  }

  get poolsActiveUsersCount(): number {
    return this.pricesCalculationService.lastPoolsActiveUsersCount();
  }

  get farmActiveUsers(): number {
    return StaticValues.farmUsers;
  }

  get savedGasFees(): number {
    return this.pricesCalculationService.savedGasFees();
  }

  ngOnInit(): void {
  }

  openTvlDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'All'
      }
    });
  }

  openPsIncomeDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'income'
      }
    });
  }

  openWeeklyProfitDialog(): void {
    this.dialog.open(ProfitDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'Weekly profit history chart',
        name: 'Name'
      }
    });
  }

  openFarmBuybacksDialog(): void {
    this.dialog.open(FarmBuybacksDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'FARM Buyback history chart',
        name: 'Name'
      }
    });
  }

  openPsTvlDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'PS Pool'
      }
    });
  }

  openSavedFeesDialog() {
    this.dialog.open(HardWorkHistoryDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'Saved Gas Fees History',
        name: 'Name'
      }
    });
  }

  openTotalUsersDialog() {
    this.dialog.open(TotalUsersDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'Total users history',
        name: 'Name'
      }
    });
  }
}
