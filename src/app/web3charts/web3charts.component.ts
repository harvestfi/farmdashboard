import { Component, OnInit } from '@angular/core'
import { Web3Service } from '../services/web3.service'
import { times, ethblocksperhour, ethblocksperday } from '../statistic-board/Abi'
import type { Period } from '../statistic-board/Abi'

@Component({
  selector: 'app-web3charts',
  templateUrl: './web3charts.component.html',
  styleUrls: ['./web3charts.component.css']
})
export class Web3chartsComponent implements OnInit {
  selectedPeriod: Period = times[2]
  preriodValues: Period[] = times
  
  isLoading = true
  
  contracts = []
  selectedContractId = null

  chartsData = {
    shares: null,
    tvl: null,
  }

  constructor(private web3: Web3Service) { }

  async ngOnInit() {
    await this.web3.init()
    this.getContractList()
    this.selectedContractId = this.contracts[0].id
    await this.getChartData()
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

  async selectPeriod(period: Period) {
    this.selectedPeriod = period
    this.getChartData()
  }

  showLoader() {
    this.isLoading = true
  }

  hideLoader() {
    this.isLoading = false
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

    const [responseShares, responsepTvl] = await Promise.allSettled([pShares, pTvl])

    this.chartsData = {
      shares: responseShares,
      tvl: responsepTvl,
    }

    // console.log('- - - - response', {
    //   shares: responseShares,
    //   tvl: responsepTvl,
    // })

    this.hideLoader()
  }
}
