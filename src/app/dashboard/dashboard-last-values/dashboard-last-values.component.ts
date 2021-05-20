import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StaticValues} from '../../static/static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Addresses} from '../../static/addresses';
import {KatexOptions} from 'ng-katex';

@Component({
  selector: 'app-dashboard-last-values',
  templateUrl: './dashboard-last-values.component.html',
  styleUrls: ['./dashboard-last-values.component.scss']
})
export class DashboardLastValuesComponent implements OnInit {
  katexOptions: KatexOptions = {
    displayMode: true,
  };
  @ViewChild('FARMStakedModal') private FARMStakedModal: CustomModalComponent;
  @ViewChild('weeklyProfitModal') private weeklyProfitModal: CustomModalComponent;
  @ViewChild('tvlModal') private tvlModal: CustomModalComponent;
  @ViewChild('farmBuybacksModal') private farmBuybacksModal: CustomModalComponent;
  @ViewChild('savedFeesModal') private savedFeesModal: CustomModalComponent;
  @ViewChild('totalUsersModal') private totalUsersModal: CustomModalComponent;
  @ViewChild('gasPriceModal') private gasPriceModal: CustomModalComponent;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
              public dialog: MatDialog,
              public vt: ViewTypeService,
              private hardworkData: HardworkDataService,
              private harvestData: HarvestDataService,
              private priceData: PriceDataService,
              private log: NGXLogger
  ) {
  }

  ngOnInit(): void {
  }

  // TODO split to classes
  // ------------- HARDWORK DATA ---------------------------

  totalGasSaved(network: string): number {
    return this.hardworkData.getTotalGasSaved(network);
  }

  totalGasSavedAllNetworks(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.hardworkData.getTotalGasSaved(network))
    .reduce((p, n) => p + n, 0);
  }

  farmBuybackSum(network: string): number {
    if (!this.farmUsdPrice || this.farmUsdPrice === 0) {
      return 0;
    }
    let sum = this.hardworkData.getLatestHardWork(network)?.farmBuybackSum || 0;
    if (network === 'bsc') {
      sum /= this.farmUsdPrice;
    }
    return sum / 1000;
  }

  get totalFarmBuybacks(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.farmBuybackSum(network))
    .reduce((p, n) => n + p, 0);
  }

  get totalWeeklyProfits(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.hardworkData.getWeeklyProfits(network))
    .reduce((p, n) => p + n, 0);
  }

  weeklyProfits(network: string): number {
    return this.hardworkData.getWeeklyProfits(network);
  }

  get priceToEarningsRatio(): number {
    const earningPerShare = this.psYearEarning / this.farmTotalAmount;
    return this.farmUsdPrice / earningPerShare;
  }

  get psYearEarning() {
    const psLastWeekEarned = this.hardworkData.getWeeklyProfits('eth') * 0.3
        + this.hardworkData.getWeeklyProfits('bsc') * 0.08;
    return psLastWeekEarned * 52.1429;
  }

  get farmTotalAmount(): number {
    const lastPsHarvest =
        this.harvestData.getVaultLastInfo(Addresses.ADDRESSES.get('PS'), 'eth');
    if (!lastPsHarvest) {
      return 0;
    }
    return lastPsHarvest.totalAmount;
  }

  // --------------- HARVEST DATA -----------------------------

  gas(network: string): number {
    return this.harvestData.getLastGas(network);
  }

  get psFarmTvl(): number {
    return this.harvestData.getVaultLastInfo(this.psAddress, 'eth')?.lastTvl;
  }

  get farmTotalSupply(): number {
    return this.harvestData.getVaultLastInfo(this.psAddress, 'eth')?.sharePrice;
  }

  get lpFarmStaked(): number {
    return this.harvestData.getLpFarmStaked();
  }

  tvlSum(network: string): number {
    return this.harvestData.getTvlSum(network, this.priceData);
  }

  get tvlSumAllNetwork(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.tvlSum(network))
    .reduce((p, n) => p + n, 0);
  }

  userCount(network: string): number {
    return this.harvestData.getUserCounts(network);
  }

  get userCountAllNetwork(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.userCount(network))
    .reduce((p, n) => p + n, 0);
  }

  poolUsers(network: string): number {
    return this.harvestData.getAllVaultsUsers(network);
  }

  get poolUsersAllNetwork(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.poolUsers(network))
    .reduce((p, n) => p + n, 0);
  }

  // --------------------------- PRICES -------------------------

  get farmUsdPrice(): number {
    return this.priceData.getLastFarmPrice();
  }

  get btcUsdPrice(): number {
    return this.priceData.getUsdPrice(Addresses.ADDRESSES.get('WBTC'), 'eth');
  }

  get ethUsdPrice(): number {
    return this.priceData.getUsdPrice(Addresses.ADDRESSES.get('WETH'), 'eth');
  }

  get bnbUsdPrice(): number {
    return this.priceData.getUsdPrice(Addresses.ADDRESSES.get('WBNB'), 'bsc');
  }

  // -------------- OPEN MODALS ---------------------

  openTvlDialog(): void {
    this.tvlModal.open();
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

  get psAddress() {
    return Addresses.ADDRESSES.get('PS');
  }

  // ------------- FORMULAS -------------------------

  get peRatioHtml() {
    return `PE = `
        + `\\cfrac{FARMPrice (${this.farmUsdPrice.toFixed(0)})}`
        + `{EPS(${(this.psYearEarning / this.farmTotalAmount).toFixed(0)})}`;
  }

  get epsHtml() {
    return `EPS = `
        + ` \\cfrac{PSLastWeekProfit * WeeksInYear (${this.psYearEarning.toFixed(0)})}`
        + `{FARMTotalAmount (${this.farmTotalAmount.toFixed(0)})}`;
  }
}
