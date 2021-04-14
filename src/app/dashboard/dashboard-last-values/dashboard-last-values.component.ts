import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {StaticValues} from '../../static/static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {HttpService} from '../../services/http/http.service';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';
import {HarvestDto} from "../../models/harvest-dto";
import {HardWorkDto} from "../../models/hardwork-dto";
import {UniswapSubscriberService} from "../../services/uniswap-subscriber.service";
import {UniswapDto} from "../../models/uniswap-dto";
import {HarvestsService} from "../../services/http/harvests.service";
import {HardworksService} from "../../services/http/hardworks.service";

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
              private pricesCalculationService: PricesCalculationService,
              private harvestsService: HarvestsService,
              private hardworksService: HardworksService,
              private uniswapSubscriberService: UniswapSubscriberService,
              ) {
  }

  private lastGas = 0;
  private hardworkGasCosts = new Map<string,number>();
  private totalGasSaved = 0.0;
  private totalUserCount = 0;
  private totalPooledUsers = 0;
  private farmHolders = 0;

  ngOnInit(): void {
    this.harvestsService.getLastTvls().subscribe(harvests =>
        harvests.sort((a, b) => a.block > b.block? 1: -1)?.forEach(this.handleHarvest.bind(this)));
    this.harvestsService.subscribeToHarvests().subscribe(this.handleHarvest.bind(this));
    this.hardworksService.getLastHardWorks().subscribe(data => data.forEach(this.handleHardworks.bind(this)));
    this.hardworksService.subscribeToHardworks().subscribe(this.handleHardworks.bind(this));
    this.uniswapSubscriberService.subscribeToUniswapEvents().subscribe(this.handleUniswaps.bind(this))
    this.api.getUniswapTxHistoryData().subscribe(data => data.forEach(this.handleUniswaps.bind(this)));
  }

  private handleHarvest(harvest: HarvestDto) {
    if (harvest.lastGas != null && (harvest.lastGas + '') !== 'NaN' && harvest.lastGas !== 0) {
      this.lastGas = harvest.lastGas;
    }
    this.totalPooledUsers = harvest.allPoolsOwnersCount
    this.totalUserCount = harvest.allOwnersCount;
  }

  private handleHardworks(hardwork: HardWorkDto) {
    const lastGasSum = this.hardworkGasCosts.get(hardwork.vault) || 0;
    this.hardworkGasCosts.set(hardwork.vault, hardwork.savedGasFeesSum||0);
    this.totalGasSaved -= lastGasSum;
    this.totalGasSaved += (hardwork.savedGasFeesSum||0);
  };

  private handleUniswaps(uniswap: UniswapDto){
    this.farmHolders = uniswap.ownerCount;
  }

  get lastPriceF(): number {
    return this.pricesCalculationService.lastFarmPrice();
  }

  get allTvlF(): number {
    return this.pricesCalculationService.allTvls;
  }

  get btcF(): number {
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

  get farmLpStaked(): number {
    return this.pricesCalculationService.farmLpStaked();
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
