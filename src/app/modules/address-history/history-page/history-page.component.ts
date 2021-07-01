import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '@data/services/http/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HarvestDto} from '@data/models/harvest-dto';
import {Utils} from '@data/static/utils';
import {NGXLogger} from 'ngx-logger';
import {TransferDto} from '@data/models/transfer-dto';
import {ChartBuilder} from '@modules/chart/chart-builder';
import {IChartApi} from 'lightweight-charts';
import {ChartsOptionsLight} from '@modules/chart/charts-options-light';
import {ViewTypeService} from '@data/services/view-type.service';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {HarvestsService} from '@data/services/http/harvests.service';
import {Vault} from '@data/models/vault';
import {ContractsService} from '@data/services/contracts.service';
import {Addresses} from '@data/static/addresses';

class CheckedValue {
  name: string;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements AfterViewInit, OnInit {
  @ViewChild('balance_chart') chartEl: ElementRef;
  @ViewChild('profitHistoryDialog') private profitHistoryDialog: CustomModalComponent;
  @ViewChild('historyDialog') private historyDialog: CustomModalComponent;
  chart: IChartApi;
  ready = false;
  fullData = [];
  sortedData: any[];
  includeTransfers: boolean;
  includeAll: boolean;
  vaults: CheckedValue[] = [];
  showEmptyPools: boolean;
  address: string;
  inputAddress: string;
  lastTransfer: TransferDto;
  lastStaked = new Map<string, HarvestDto>();
  balanceHistory: number[][] = [];
  balanceHistoryBySource = new Map<string, number[][]>();
  balances = new Map<string, number>();
  balance = 0;
  rewardsHistory: number[][] = [];
  rewardSum = 0;
  rewardsHistoryUsd: number[][] = [];
  rewardSumUsd = 0;
  transferTypeIncluded: CheckedValue[] = [];

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private router: Router,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              public vt: ViewTypeService,
              public harvestsService: HarvestsService,
              private contractService: ContractsService
  ) {
  }

  ngOnInit(): void {
    this.vt.events$.subscribe(event => {
      if (event === 'theme-changed') {
        this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
      }
    });
  }

  clear(): void {
    this.fullData = [];
    this.sortedData = null;
    this.includeTransfers = false;
    this.includeAll = false;
    this.vaults = [];
    this.showEmptyPools = false;
    this.address = null;
    this.inputAddress = null;
    this.lastTransfer = null;
    this.lastStaked = new Map<string, HarvestDto>();
    this.balanceHistory = [];
    this.balanceHistoryBySource = new Map<string, number[][]>();
    this.balances = new Map<string, number>();
    this.balance = 0;
    this.rewardsHistory = [];
    this.rewardSum = 0;
    this.rewardsHistoryUsd = [];
    this.rewardSumUsd = 0;
    this.transferTypeIncluded = [];
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.clear();
      this.address = params.address;
      this.inputAddress = params.address;
      this.harvestsService.getAddressHistoryHarvest(this.address).subscribe(harvests => {
            this.log.info('Load harvest history', harvests);
            harvests?.forEach(harvest => {
              HarvestDto.enrich(harvest);
              this.fullData.push(harvest);
            });

            this.http.getAddressHistoryTransfers(this.address).subscribe(transfers => {
              this.log.info('Load transfers history', transfers);
              transfers?.forEach(transfer => {
                TransferDto.enrich(transfer);
                this.fullData.push(transfer);
              });
              this.sortValues();
              this.parseValues();
              this.createBalanceChart();
            });
          }
      );
      this.cdRef.detectChanges();
    });
  }

  @HostListener('window:resize', ['$event'])
  handleScreenResize($event: any): void {
    this.chart?.resize(this.chartEl?.nativeElement?.clientWidth,
        this.chartEl?.nativeElement?.clientHeight);
  }

  private createBalanceChart(): void {
    if (this.balanceHistory.length === 0) {
      return;
    }
    this.log.info('Creat balance chart from data', this.balanceHistory);
    const chartBuilder = new ChartBuilder();
    chartBuilder.initVariables(1);
    chartBuilder.priceLineVisible = false;
    this.balanceHistory.forEach(el => chartBuilder.addInData(0, el[0], el[1]));
    this.handleData(chartBuilder, [
      ['', 'right', '#fc8f34']
    ]);
  }

  handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(this.chart, config);
  }

  changeAllInclude(): void {
    if (this.includeAll) {
      this.includeTransfers = true;
      this.vaults.forEach(c => c.checked = true);
    } else {
      this.includeTransfers = false;
      this.vaults.forEach(c => c.checked = false);
    }
  }

  sortValues(): void {
    this.sortedData = [];
    this.fullData.forEach(record => {
      if (Utils.isHarvest(record) && this.includeIn(this.vaults, record.vaultAddress)) {
        this.sortedData.push(record);
      } else if (Utils.isTransfer(record) && this.includeTransfers
          && this.includeIn(this.transferTypeIncluded, record.type)) {
        this.sortedData.push(record);
      }
    });
    this.sortedData.sort((o1, o2) => o2.blockDate - o1.blockDate);
  }

  includeIn(arr: CheckedValue[], value: string): boolean {
    const c = arr.find(el => el.value === value);
    if (c) {
      return c.checked;
    }
    return false;
  }

  parseValues(): void {
    this.fullData.sort((o1, o2) => o1.blockDate - o2.blockDate)
    .forEach(record => {
      if (Utils.isHarvest(record)) {
        this.parseHarvest(record);
      } else if (Utils.isTransfer(record)) {
        this.parseTransfer(record);
      } else {
        this.log.warn('Unknown record type', record);
      }
    });
  }

  summary(): number {
    let summary = 0;
    if (this.lastTransfer) {
      summary = this.transferBalanceUsd(this.lastTransfer);
    }
    this.lastStaked?.forEach(harvest => {
      summary += harvest.ownerBalanceUsd;
    });
    return summary;
  }

  private parseHarvest(record: HarvestDto): void {
    const harvest = this.lastStaked.get(record.vaultAddress);
    this.addInCheckedArr(this.vaults, record.vault, record.vaultAddress, false);
    this.saveHarvestBalance(record);
    // this.profit += record
    if (harvest) {
      if (harvest.blockDate < record.blockDate) {
        this.lastStaked.set(record.vaultAddress, record);
      }
    } else {
      this.lastStaked.set(record.vaultAddress, record);
    }
  }

  private parseTransfer(record: TransferDto): void {
    // todo need to investigate the problem with whole balance
    // this.saveTransferBalance(record);
    this.addInCheckedArr(this.transferTypeIncluded, record.type, record.type, true);
    if (record.type === 'PS_EXIT' || record.type === 'REWARD') {
      this.saveReward(record.blockDate, record.profit, record.profit * record.price);
    }
    if (this.lastTransfer) {
      if (this.lastTransfer.blockDate < record.blockDate) {
        this.lastTransfer = record;
      }
    } else {
      this.lastTransfer = record;
    }
  }

  private saveReward(blockDate: number, profit: number, profitUsd: number): void {
    this.rewardSum += profit;
    this.rewardsHistory.push([blockDate, this.rewardSum]);
    this.rewardSumUsd += profitUsd;
    this.rewardsHistoryUsd.push([blockDate, this.rewardSumUsd]);
  }

  private saveHarvestBalance(record: HarvestDto): void {
    if (this.balances.has(record.vaultAddress)) {
      const oldBalance = this.balances.get(record.vaultAddress);
      const balanceDiff = record.ownerBalanceUsd - oldBalance;
      this.balance += balanceDiff;
      this.balances.set(record.vaultAddress, record.ownerBalanceUsd);
    } else {
      this.balances.set(record.vaultAddress, record.ownerBalanceUsd);
      this.balance += record.ownerBalanceUsd;
    }
    this.balanceHistory.push([record.blockDate, this.balance]);
    this.saveBalanceBySource(record.vaultAddress, record.blockDate, record.ownerBalanceUsd);
  }

  private saveTransferBalance(record: TransferDto): void {
    if (record.type === 'PS_EXIT'
        || record.type === 'PS_STAKE'
        || record.type === 'LP_ADD'
        || record.type === 'LP_REM'
    ) {
      return;
    }
    const addressBalance = TransferDto.getBalanceForAddress(record, this.address) * record.price;
    if (this.balances.has(record.name)) {
      const oldBalance = this.balances.get(record.name);
      const balanceDiff = addressBalance - oldBalance;
      this.log.info('balance tr', oldBalance, addressBalance);
      this.balance += balanceDiff;
      this.balances.set(record.name, addressBalance);
    } else {
      this.balances.set(record.name, addressBalance);
      this.balance += addressBalance;
    }
    this.balanceHistory.push([record.blockDate, this.balance]);
    this.saveBalanceBySource(record.name, record.blockDate, addressBalance);
  }

  private saveBalanceBySource(address: string, blockDate: number, balance: number): void {
    if (this.balanceHistoryBySource.has(address)) {
      this.balanceHistoryBySource.get(address).push([blockDate, balance]);
    } else {
      const arr = [];
      arr.push([blockDate, balance]);
      this.balanceHistoryBySource.set(address, arr);
    }
  }

  private addInCheckedArr(arr: CheckedValue[], name: string, value: string, defaultValue: boolean): void {
    if (arr.find(el => el.value === value)) {
      return;
    }
    const c = new CheckedValue();
    c.name = name;
    c.value = value;
    c.checked = defaultValue;
    arr.push(c);
  }

  transferBalanceUsd(t: TransferDto): number {
    return Utils.transferBalanceUsd(t, this.address);
  }

  isPositive(record: any): boolean {
    return Utils.isHarvestPositive(record) || Utils.isUniPositive(record);
  }

  isHarvest(record: any): boolean {
    return Utils.isHarvest(record);
  }

  isTransfer(record: any): boolean {
    return Utils.isTransfer(record);
  }

  openHistoryDialog(): void {
    this.historyDialog.open();
  }

  openProfitHistoryDialog(): void {
    this.profitHistoryDialog.open();
  }

  prettyTransferType(type: string): string {
    return Utils.prettyTransferType(type);
  }

  routeToAddress(address: string | undefined): void {
    if (!address) {
      return;
    }
    this.router.navigateByUrl('/history/' + address);
  }

  getVault(address: string): Vault {
    if (!address.startsWith('0x')) {
      address = Addresses.ADDRESSES.get(address);
    }
    return this.contractService.getContracts(Vault).get(address);
  }
}
