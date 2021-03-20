import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { times, ethblocksperhour, ethblocksperday } from '../statistic-board/Abi'
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { ViewTypeService } from '../services/view-type.service'
import { ChartBuilder } from '../chart/chart-builder'
import {IChartApi} from 'lightweight-charts';

import type { Period } from '../statistic-board/Abi'
@Component({
  selector: 'app-web3charts',
  templateUrl: './web3charts.component.html',
  styleUrls: ['./web3charts.component.css']
})
export class Web3chartsComponent extends ChartGeneralMethodsComponent implements OnInit { // AfterViewInit
  @ViewChild('chartShares') chartSharesRef: ElementRef;
  @ViewChild('chartTvl') chartTvlRef: ElementRef;
  chartShares: IChartApi;
  chartTvl: IChartApi;

  selectedPeriod: Period = times[3]
  preriodValues: Period[] = times
  
  isLoading = true
  
  contracts = []
  selectedContractId = null

  chartsData = {
    shares: null,
    tvl: null,
  }

  constructor(
    public vt: ViewTypeService,
    private web3: Web3Service,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  async ngOnInit() {
    await this.web3.init()
    this.getContractList()
    this.selectedContractId = this.contracts[6].id
    await this.getChartData()
    this.renderCharts();
  }

  getContractList() {
    this.contracts = this.web3.constracts.map((el) => {
      return {
        id: el.contract.id,
        name: el.contract.name,
      }
    })
  }

  async selectContract(contractId) {
    this.selectedContractId = Number(contractId)
    await this.getChartData()
  }

  async selectPeriod(period: Period) {
    this.selectedPeriod = period
    await this.getChartData()
  }

  showLoader() {
    this.isLoading = true
  }

  hideLoader() {
    this.isLoading = false
  }

  renderCharts() {
    this.handleData(
      this.chartsData.shares,
      [['Shares', 'right', '#7e7e7e']],
      this.chartSharesRef,
      this.chartShares,
    );

    this.handleData(
      this.chartsData.tvl,
      [['TVL ', 'right', '#7e7e7e']],
      this.chartTvlRef,
      this.chartTvl,
    );
  }

  private handleData(data: any, config: string[][], elRef: ElementRef, chart: IChartApi): void {
    if (!data) {
      return
    }
    
    const builder = new ChartBuilder();
    builder.initVariables(1);

    data.forEach(item => {
      builder.addInData(0, item.timestamp, item.share);
    })
    this.cdRef.detectChanges();
    chart = builder.initChart(elRef)
    builder.addToChart(chart, config)
  }

  async getChartData() {
    this.showLoader()

    const blocksPeriod = this.selectedPeriod.value === 24 ? ethblocksperhour : ethblocksperday
    
    const pShares = this.web3.getPrice(
      this.selectedContractId,
      this.selectedPeriod.value,
      blocksPeriod,
      'shares'
    )
    
    const pTvl = this.web3.getPrice(
      this.selectedContractId,
      this.selectedPeriod.value,
      blocksPeriod,
      'tvl'
    )

    // @ts-ignore
    const [{ value: responseShares }, { value: responsepTvl }] = await Promise.allSettled([pShares, pTvl])

    this.chartsData = {
      shares: responseShares,
      tvl: responsepTvl,
    }

    console.log('- - - - response', {
      shares: responseShares,
      tvl: responsepTvl,
    })

    this.hideLoader()
  }
}
