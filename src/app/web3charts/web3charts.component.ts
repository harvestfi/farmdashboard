import { Component, AfterViewInit } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { formatUnits } from "@ethersproject/units";

export type Period = {
  key: number;
  value: number;
  text: string;
} 

export const ethblocksperday = 6530;
export const ethblocksperhour = 272;

@Component({
  selector: 'app-web3charts',
  templateUrl: './web3charts.component.html',
  styleUrls: ['./web3charts.component.css']
})
export class Web3chartsComponent implements AfterViewInit { 

  preriodValues: Period[] = [
    { key: 1, value: 24, text: "last 24h" },
    { key: 2, value: 3, text: "3d" },
    { key: 3, value: 5, text: "5d" },
    { key: 4, value: 7, text: "7d" },
    { key: 6, value: 14, text: "14d" },
  ]

  selectedPeriod: Period = this.preriodValues[2]
  
  isLoading = true
  
  contracts = []
  selectedContractId = null
 
  chartsData = {
    shares: null,
    tvl: null,
  }
 
  constructor(
    private web3service: Web3Service,
  ) {}
 
   ngAfterViewInit() {
    this.web3service.init()
      .then(() => {
        this.getContractList()
        this.selectedContractId = this.contracts[17].id
        this.getChartData()
      })
  }
 
  getContractList() {
    this.contracts = this.web3service.constracts.map((el) => {
      return {
        id: el.contract.id,
        name: el.contract.name,
      }
    })
  }
   
  selectContract(contractId) {
    this.selectedContractId = Number(contractId)
    this.getChartData()
  }
   
  selectPeriod(period: Period) {
    this.selectedPeriod = period
    this.getChartData()
  }
 
  showLoader() {
    this.isLoading = true
  }
 
  hideLoader() {
    this.isLoading = false
  }
   
  getChartData() {
    this.showLoader()
 
    const blocksPeriod = this.selectedPeriod.value === 24 ? ethblocksperhour : ethblocksperday
    
    const pShares = this.getPrice(
      this.selectedContractId,
      this.selectedPeriod.value,
      blocksPeriod,
      'shares'
    )
    
    const pTvl = this.getPrice(
      this.selectedContractId,
      this.selectedPeriod.value,
      blocksPeriod,
      'tvl'
    )

    Promise.allSettled([pShares, pTvl])
      .then(([responseShares, responseTvl]) => {
        if (responseShares.status === 'fulfilled') {
          this.chartsData.shares = responseShares.value
        }
        if (responseTvl.status === 'fulfilled') {
          this.chartsData.tvl = responseTvl.value
        }
        this.hideLoader()
      })
  }

  async getPrice<TP extends number >(
    contractId,
    timePeriod: TP,
    blocksPeriod: typeof ethblocksperday | typeof ethblocksperhour,
    contractMethod: 'shares' | 'tvl'
  ) {
    const contract = this.web3service.constracts.find(el => el.contract.id === contractId)

    let chartData = []
    
    const methods = {
        shares: contract.web3.methods.getPricePerFullShare(), 
        tvl: contract.web3.methods.totalSupply(),
    }

    const ethCurrentBlock = await this.web3service.getCurrentBlockNumber()
    
    for (let i = 0; i < timePeriod; i++) {
        let block = ethCurrentBlock - (blocksPeriod * i);
        
        const response = await methods[contractMethod].call({}, block).catch(error => console.log(error))
        const { timestamp } = await this.web3service.web3.eth.getBlock(block);
        
        const value = formatUnits(response, contract.decimals)
        
        chartData.push({ block, value: Number(value), index: i, timestamp  })
    }

    return chartData;
  }
}
