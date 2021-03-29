import { Component, AfterViewInit } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { times, ethblocksperhour, ethblocksperday } from './Abi'
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
    private web3: Web3Service,
  ) {}
 
   ngAfterViewInit() {
    this.web3.init()
      .then(() => {
        this.getContractList()
        this.selectedContractId = this.contracts[14].id
        this.getChartData()
      })
  }
 
  getContractList() {
    this.contracts = this.web3.constracts.map((el) => {
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
}
