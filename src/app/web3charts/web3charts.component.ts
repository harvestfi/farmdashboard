import { Component, AfterViewInit } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { formatUnits } from "@ethersproject/units";

export type Period = {
  key: number;
  value: number;
  text: string;
} 

type ChartData = {
  value: number
  timestamp: number | string
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
 
  chartsData: {
    shares: ChartData[]
    tvl: ChartData[]
  } = {
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
  ): Promise<ChartData[]> {
    const contract = this.web3service.constracts.find(el => el.contract.id === contractId)
    
    const methods = {
        shares: contract.web3.methods.getPricePerFullShare(), 
        tvl: contract.web3.methods.totalSupply(),
    }

    return this.web3service.getCurrentBlockNumber().then(ethCurrentBlock => {
      return Array.from({ length: timePeriod })
        .map((_, i) => {
          let block = ethCurrentBlock - (blocksPeriod * i);

          return Promise.allSettled([
            methods[contractMethod].call({}, block)
              .then(value => formatUnits(value, contract.decimals))
              .catch(error => console.log(error)),
            this.web3service.web3.eth.getBlock(block)
              .then(response => response.timestamp)
          ])
      })
    })
    .then(requests => {
      return Promise.allSettled(requests).then(values => {
        return values.map(el => {
          const item: Partial<ChartData> = {}

          if (el.status === 'fulfilled') {
            const [valuePromise, timestampPromise] = el.value
            item.value = valuePromise.status === 'fulfilled' ? valuePromise.value : null
            item.timestamp = timestampPromise.status === 'fulfilled' ? timestampPromise.value : null
          }
          
          return item as ChartData
        })
      })
    })    
  }
}
