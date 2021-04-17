import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {StaticValues} from '../../static/static-values';
import {ViewTypeService} from '../../services/view-type.service';
import {HttpService} from '../../services/http/http.service';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';
import {HarvestDto} from '../../models/harvest-dto';
import {HardWorkDto} from '../../models/hardwork-dto';
import {UniswapDto} from '../../models/uniswap-dto';
import {HarvestsService} from '../../services/http/harvests.service';
import {HardworksService} from '../../services/http/hardworks.service';
import {UniswapService} from '../../services/http/uniswap.service';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {VaultStats} from '../../models/vault-stats';
import {PricesService} from '../../services/http/prices.service';
import {PricesDto} from '../../models/prices-dto';

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
              private harvestsService: HarvestsService,
              private hardworksService: HardworksService,
              private uniswapSubscriberService: UniswapService,
              private pricesService: PricesService
              ) {
  }

  private lastGas = 0;
  private hardworkGasCosts = new Map<string,number>();
  private totalGasSaved = 0.0;
  private totalUserCount = new Map<string,number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private totalPoolUsers = new Map<string,number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private weeklyProfits = new Map<string,number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private farmBuybacks = new Map<string,number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private totalTvls = new Map<string,number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private harvestTvls = new Map<string,number>();
  private prices = new Map<string,PricesDto>();
  private farmHolders = 0;
  private farmStaked = 0;
  private farmTotalSupply = 0;
  private lpFarmStaked = 0;

  ngOnInit(): void {
    this.harvestsService.getLastTvls(StaticValues.NETWORKS.get('bsc')).subscribe(harvests =>
        harvests.sort((a, b) => a.block > b.block? 1: -1)?.forEach(this.handleHarvest.bind(this)));
    this.harvestsService.getLastTvls(StaticValues.NETWORKS.get('eth')).subscribe(harvests =>
        harvests.sort((a, b) => a.block > b.block? 1: -1)?.forEach(this.handleHarvest.bind(this)));
    this.harvestsService.subscribeToHarvests().subscribe(this.handleHarvest.bind(this));
    this.hardworksService.getLastHardWorks().subscribe(data => data?.forEach(this.handleHardworks.bind(this)));
    this.hardworksService.subscribeToHardworks().subscribe(this.handleHardworks.bind(this));
    this.uniswapSubscriberService.subscribeToUniswapEvents().subscribe(this.handleUniswaps.bind(this));
    this.uniswapService.getUniswapTxHistoryData().subscribe(data => data.forEach(this.handleUniswaps.bind(this)));
    this.pricesService.getLastPrices().subscribe(data => data?.forEach(this.handlePrice.bind(this)));
    this.pricesService.subscribeToPrices().subscribe(this.handlePrice.bind(this));
  }

  private handleHarvest(harvest: HarvestDto) {
    HarvestDto.enrich(harvest);
    if (harvest.lastGas != null && (harvest.lastGas + '') !== 'NaN' && harvest.lastGas !== 0) {
      this.lastGas = harvest.lastGas;
    }
    this.totalPoolUsers.set(harvest.network, harvest.allPoolsOwnersCount);
    this.totalUserCount.set(harvest.network, harvest.allOwnersCount);
    this.updateFarmStaked(harvest);
    this.updateTvl(harvest);
  }

  private updateFarmStaked(harvest: HarvestDto) {
    if (harvest.vault === 'PS') {
      this.farmStaked = harvest.lastTvl;
      this.farmTotalSupply = harvest.sharePrice;
    }
    if(StaticValues.farmPools.findIndex(farmPool => farmPool === harvest.vault) >= 0)
      {this.lpFarmStaked =  [1,2].reduce((prev, i) => {
        if(harvest.lpStatDto[`coin${i}`] === 'FARM') {return harvest.lpStatDto[`amount${i}`];}
        return prev;
      }, 0.0);}
  }

  private handleHardworks(hardwork: HardWorkDto) {
    const lastGasSum = this.hardworkGasCosts.get(hardwork.vault) || 0;
    this.hardworkGasCosts.set(hardwork.vault, hardwork.savedGasFeesSum||0);
    this.totalGasSaved -= lastGasSum;
    this.totalGasSaved += (hardwork.savedGasFeesSum||0);
    this.weeklyProfits.set(hardwork.network, hardwork.weeklyAllProfit / 0.7);
    this.farmBuybacks.set(hardwork.network, hardwork?.farmBuybackSum / 1000);
  };

  private handleUniswaps(uniswap: UniswapDto){
    this.farmHolders = uniswap.ownerCount;
  }

  private handlePrice(price: PricesDto) {
    this.prices.set(price.id, price);
  }

  private updateTvl(harvest: HarvestDto) {
    const prevHarvestTvl = this.harvestTvls.get(harvest.vault) || 0;
    const prevTotalNetworkTvl = this.totalTvls.get(harvest.network) || 0;
    this.harvestTvls.set(harvest.vault, harvest.lastUsdTvl);
    if(harvest.vault !== 'iPS'){
      this.totalTvls.set(harvest.network, prevTotalNetworkTvl - prevHarvestTvl + harvest.lastUsdTvl);
    }
  }

  get lastPriceF(): number {
    return this.pricesCalculationService.lastFarmPrice();
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

  get psApy(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
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
