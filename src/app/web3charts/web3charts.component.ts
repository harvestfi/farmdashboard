import { Component, AfterViewInit } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { times, ethblocksperhour, ethblocksperday } from './Abi'
import { formatUnits } from "@ethersproject/units";
import type { Period } from './Abi'

@Component({
  selector: 'app-web3charts',
  templateUrl: './web3charts.component.html',
  styleUrls: ['./web3charts.component.css']
})
export class Web3chartsComponent implements AfterViewInit { 
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
    
    for (let i = 0; i < timePeriod; i++) {
        let block = this.web3service.ethCurrentBlock - (blocksPeriod * i);
        
        const response = await methods[contractMethod].call({}, block).catch(error => console.log(error))
        const { timestamp } = await this.web3service.web3.eth.getBlock(block);
        
        const value = formatUnits(response, contract.decimals)
        
        chartData.push({ block, value: Number(value), index: i, timestamp  })
    }

    return chartData;
  }
}
