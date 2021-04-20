import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {StaticValues} from '../../static/static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {UniswapDto} from '../../models/uniswap-dto';
import {UniswapService} from '../../services/http/uniswap.service';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {PricesService} from '../../services/http/prices.service';
import {PricesDto} from '../../models/prices-dto';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';

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

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
              public dialog: MatDialog,
              public vt: ViewTypeService,
              private uniswapService: UniswapService,
              private pricesCalculationService: PricesCalculationService,
              private uniswapSubscriberService: UniswapService,
              private pricesService: PricesService,
              private hardworkData: HardworkDataService,
              private harvestData: HarvestDataService,
              private log: NGXLogger
  ) {
  }

  private prices = new Map<string, PricesDto>();
  farmHolders = 0;

  ngOnInit(): void {

    //UNISWAP LOADING
    this.uniswapSubscriberService.subscribeToUniswapEvents().subscribe(this.handleUniswaps.bind(this));
    this.uniswapService.getUniswapTxHistoryData().subscribe(data =>
        data?.forEach(this.handleUniswaps.bind(this))
    );

    // PRICE LOADING
    this.pricesService.getLastPrices().subscribe(data =>
        data?.forEach(this.handlePrice.bind(this))
    );
    this.pricesService.subscribeToPrices().subscribe(this.handlePrice.bind(this));
  }

  private handleUniswaps(uniswap: UniswapDto) {
    this.farmHolders = uniswap.ownerCount;
  }

  private handlePrice(price: PricesDto) {
    this.prices.set(price.id, price);
  }

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
    if (!this.lastPriceF || this.lastPriceF === 0) {
      return 0;
    }
    let sum = this.hardworkData.getFarmBuybacks(network);
    if (network === 'bsc') {
      sum /= this.lastPriceF;
    }
    return sum;
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

  // --------------- HARVEST DATA -----------------------------

  gas(network: string): number {
    return this.harvestData.getLastGas(network);
  }

  get psFarmTvl(): number {
    return this.harvestData.getPsFarmTvl();
  }

  get farmTotalSupply(): number {
    return this.harvestData.getFarmTotalSupply();
  }

  get lpFarmStaked(): number {
    return this.harvestData.getLpFarmStaked();
  }

  tvlSum(network: string): number {
    return this.harvestData.getTvlSum(network);
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
    return this.harvestData.getPoolUsers(network);
  }

  get poolUsersAllNetwork(): number {
    return Array.from(StaticValues.NETWORKS.keys())
    .map(network => this.poolUsers(network))
    .reduce((p, n) => p + n, 0);
  }

  // --------------------------- OTHER -------------------------

  get lastPriceF(): number {
    return this.pricesCalculationService.lastFarmPrice();
  }

  get btcF(): number {
    return this.pricesCalculationService.getPrice('BTC', this.config.defaultNetwork);
  }

  get ethF(): number {
    return this.pricesCalculationService.getPrice('ETH', this.config.defaultNetwork);
  }

  get bnbF(): number {
    return this.pricesCalculationService.getPrice('WBNB', 'bsc');
  }

  get psApy(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  // -------------- OPEN MODALS ---------------------

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
