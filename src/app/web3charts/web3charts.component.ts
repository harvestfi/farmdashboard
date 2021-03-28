import { BalanceChartOptions } from './../history/balance-chart-options';
import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { times, ethblocksperhour, ethblocksperday } from '../statistic-board/Abi'
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { ViewTypeService } from '../services/view-type.service'
import { ChartBuilder } from '../chart/chart-builder'
import { IChartApi } from 'lightweight-charts';


import type { Period } from '../statistic-board/Abi'
@Component({
  selector: 'app-web3charts',
  templateUrl: './web3charts.component.html',
  styleUrls: ['./web3charts.component.css']
})
export class Web3chartsComponent extends ChartGeneralMethodsComponent implements AfterViewInit { // AfterViewInit 
  @ViewChild('chartShares') chartSharesRef: ElementRef;
  @ViewChild('chartTvl') chartTvlRef: ElementRef;
  chartShares: IChartApi;
  chartTvl: IChartApi;
 
  selectedPeriod: Period = times[2]
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
 
  async ngAfterViewInit() {
    await this.web3.init()
    this.getContractList()
    this.selectedContractId = this.contracts[14].id
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
    this.renderCharts();
  }
 
  async selectPeriod(period: Period) {
    this.selectedPeriod = period
    await this.getChartData()
    this.renderCharts();
  }
 
  showLoader() {
    this.isLoading = true
  }
 
  hideLoader() {
    this.isLoading = false
  }
 
  renderCharts() {

    if (this.chartShares) {
      this.chartShares.remove()
    } 
    const sharesChartBuilder = new ChartBuilder();
    sharesChartBuilder.initVariables(1);
    this.chartsData.shares.forEach(el => {
      sharesChartBuilder.addInData(0, el.timestamp, el.share)
    })
    
    this.cdRef.detectChanges();
    this.chartShares = sharesChartBuilder.initChart(this.chartSharesRef);
    sharesChartBuilder.addToChart(this.chartShares, [['Shares', 'right', '#7e7e7e']]);
    
    // this.chartShares.timeScale();

    if (this.chartTvl) {
      this.chartTvl.remove()
    }

    const tvlChartBuilder = new ChartBuilder();
    tvlChartBuilder.initVariables(1);
    this.chartsData.tvl.forEach(el => {
      tvlChartBuilder.addInData(0, el.timestamp, el.share)
    })
    
    this.cdRef.detectChanges();
    this.chartTvl = tvlChartBuilder.initChart(this.chartTvlRef);
    tvlChartBuilder.addToChart(this.chartTvl, [['TVL ', 'right', '#7e7e7e']]);

    // this.chartTvl.timeScale();
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
 
    this.hideLoader()
  }
}
