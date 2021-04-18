import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {StaticValues} from '../../static/static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {HttpService} from '../../services/http/http.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {APP_CONFIG, AppConfig} from '../../../app.config';

@Component({
  selector: 'app-dashboard-last-values',
  templateUrl: './dashboard-last-values.component.html',
  styleUrls: ['./dashboard-last-values.component.scss']
})
export class DashboardLastValuesComponent implements OnInit {
  @ViewChild('FARMStakedModal') private FARMStakedModal: CustomModalComponent;
  @ViewChild('weeklyProfitModal') private weeklyProfitModal: CustomModalComponent;
  @ViewChild('psIncomeModal') private psIncomeModal: CustomModalComponent;
  @ViewChild('tvlModal') private tvlModal: CustomModalComponent;
  @ViewChild('farmBuybacksModal') private farmBuybacksModal: CustomModalComponent;
  @ViewChild('savedFeesModal') private savedFeesModal: CustomModalComponent;
  @ViewChild('totalUsersModal') private totalUsersModal: CustomModalComponent;
  @ViewChild('gasPriceModal') private gasPriceModal: CustomModalComponent;
  constructor(public dialog: MatDialog,
              public vt: ViewTypeService,
              private api: HttpService,
              @Inject(APP_CONFIG) private config: AppConfig,
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
    if (this.config.defaultNetwork === 'bsc') {
      return this.pricesCalculationService.getPrice('BTCB');
    }
    return this.pricesCalculationService.getPrice('BTC');
  }

  get ethF(): number {
    return this.pricesCalculationService.getPrice('ETH');
  }

  get farmStaked(): number {
    return this.farmPsStaked + this.farmLpStaked;
  }

  get farmPsStaked(): number {
    return this.pricesCalculationService.farmPsStaked();
  }

  get farmNewPsStaked(): number {
    return this.pricesCalculationService.farmNewPsStaked();
  }

  get farmLpStaked(): number {
    return this.pricesCalculationService.farmLpStaked();
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
    const hw = this.pricesCalculationService.latestHardWork;
    if (hw && hw.network === 'bsc') {
      return (hw?.farmBuybackSum / 1000) / this.pricesCalculationService.lastFarmPrice();
    }
    return hw?.farmBuybackSum / 1000;
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
    this.tvlModal.open();
  }

  openPsIncomeDialog(): void {
    this.psIncomeModal.open();
  }

  openWeeklyProfitDialog(): void {
    this.weeklyProfitModal.open();
  }

  openFarmBuybacksDialog(): void {
    this.farmBuybacksModal.open();
  }

  openPsTvlDialog(): void {
    this.FARMStakedModal.open();
  }

  openSavedFeesDialog(): void {
    this.savedFeesModal.open();
  }

  openTotalUsersDialog(): void {
    this.totalUsersModal.open();
  }

  openGasPriceDialog(): void {
    this.gasPriceModal.open();
  }
}
