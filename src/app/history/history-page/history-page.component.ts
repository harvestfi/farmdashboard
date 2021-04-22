import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';
import {NGXLogger} from 'ngx-logger';
import {TransferDto} from '../../models/transfer-dto';
import {ChartBuilder} from '../../chart/chart-builder';
import { IChartApi } from 'lightweight-charts';
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { ChartsOptionsLight } from 'src/app/chart/charts-options-light';
import { ViewTypeService } from 'src/app/services/view-type.service';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';
import {HarvestsService} from '../../services/http/harvests.service';

class CheckedValue {
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
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
              ) {
                super(cdRef, vt);
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
      if (Utils.isHarvest(record) && this.includeIn(this.vaults, record.vault)) {
        this.sortedData.push(record);
      } else if (Utils.isTransfer(record) && this.includeTransfers
          && this.includeIn(this.transferTypeIncluded, record.type)) {
        this.sortedData.push(record);
      }
    });
    this.sortedData.sort((o1, o2) => o2.blockDate - o1.blockDate);
  }

  includeIn(arr: CheckedValue[], name: string): boolean {
    const c = arr.find(el => el.value === name);
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
    const harvest = this.lastStaked.get(record.vault);
    this.addInCheckedArr(this.vaults, record.vault, false);
    this.saveHarvestBalance(record);
    // this.profit += record
    if (harvest) {
      if (harvest.blockDate < record.blockDate) {
        this.lastStaked.set(record.vault, record);
      }
    } else {
      this.lastStaked.set(record.vault, record);
    }
  }

  private parseTransfer(record: TransferDto): void {
    // todo need to investigate the problem with whole balance
    // this.saveTransferBalance(record);
    this.addInCheckedArr(this.transferTypeIncluded, record.type, true);
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
    if (this.balances.has(record.vault)) {
      const oldBalance = this.balances.get(record.vault);
      const balanceDiff = record.ownerBalanceUsd - oldBalance;
      this.balance += balanceDiff;
      this.balances.set(record.vault, record.ownerBalanceUsd);
    } else {
      this.balances.set(record.vault, record.ownerBalanceUsd);
      this.balance += record.ownerBalanceUsd;
    }
    this.balanceHistory.push([record.blockDate, this.balance]);
    this.saveBalanceBySource(record.vault, record.blockDate, record.ownerBalanceUsd);
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

  private saveBalanceBySource(name: string, blockDate: number, balance: number): void {
    if (this.balanceHistoryBySource.has(name)) {
      this.balanceHistoryBySource.get(name).push([blockDate, balance]);
    } else {
      const arr = [];
      arr.push([blockDate, balance]);
      this.balanceHistoryBySource.set(name, arr);
    }
  }

  private addInCheckedArr(arr: CheckedValue[], name: string, defaultValue: boolean): void {
    if (arr.find(el => el.value === name)) {
      return;
    }
    const c = new CheckedValue();
    c.value = name;
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
}
