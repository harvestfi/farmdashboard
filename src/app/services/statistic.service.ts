import { Injectable } from '@angular/core';
import { obj, ethblocksperday, ethblocksperhour, web3, sushiabi, proxyABI } from '../statistic-board/Abi';
import { formatUnits } from "@ethersproject/units";
import axios from 'axios';
import { times } from '../statistic-board/Abi'

import type { Mode } from '../statistic-board/statistic-board-page/statistic-board-page.component';

type getDataArgs = {
  mode: Mode;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  isLoading = true;

  data: any = {
    n: times[1], // { key: 2, value: 3, text: "3d" }
    m: 'shares',
    c: 'native',
    a: ethblocksperday,
  };
  
  constructor() { }

  public async init() {
    this.contractsInitiate()
    const curBlock = await web3.eth.getBlockNumber()
    await this.getprices()
    const p = await this.sharePromises(obj, curBlock)
    this.chartsGen(p) 
    let m = p.map(({title, shareBlocks, shares, maxHistory}) => {
      return {title, shareBlocks, shares, maxHistory}
    })

    this.setdata({
      curBlock: curBlock, 
      share3data: m
    })
    this.isLoading = false
  }

  public async getData() {
    let b = await this.sharePromises(obj, this.data.curBlock)
  
    let m = b.map((contract: any) => {
        return {title: contract.title, shareBlocks: contract.shareBlocks, shares: contract.shares, maxHistory: contract.maxHistory}
    })

    return m
  }

  // моды
  handleChange = async (val) => { 
    if(val !== this.data.m){
      this.setdata({m: val}) 
      await this.process() 
    }  
  }
  // периоды
  public handleTimeChange = async (val) => {
    if(val !== this.data.n.value){
      const a = val === 24 ? ethblocksperhour : ethblocksperday
      this.setdata({n: val, a })
      await this.process()
    }
  }

  private async setdata(data, cb?) {
    this.data = {
      ...this.data,
      ...data,
    }
    if (cb) {
      await cb()
    }
  }

  private async process(){
    this.isLoading = true;

    // console.log('this.data', this.data)
    
    if(this.data.m === 'shares'){
      if(this.data.n.value === 3){ 
        this.chartsGen(this.data.share3data)   
      }
      if(this.data.n.value === 5){
        if(this.data.share5data !== undefined){
          this.chartsGen(this.data.share5data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({share5data: m})
        }
      }
      if(this.data.n.value === 7){
        if(this.data.share7data !== undefined){
          this.chartsGen(this.data.share7data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({share7data: m})
        }
      }
      if(this.data.n.value === 14){
        if(this.data.share14data !== undefined){
          this.chartsGen(this.data.share14data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({share14data: m})
        }
      }
      if(this.data.n.value === 24){
        if(this.data.share24data !== undefined){
          this.chartsGen(this.data.share24data)  
        }else{
          console.log(this.data.n.value)
          let m = await this.getData()
          
          this.chartsGen(m)
          this.setdata({share24data: m})
        }
      }
      if(this.data.n.value === 0){
        if(this.data.sharemaxdata !== undefined){
          this.chartsGen(this.data.sharemaxdata)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({sharemaxdata: m})
        }
      }
    }
  
    if(this.data.m === 'tvl'){
      if(this.data.n.value === 3){ 
        if(this.data.tvl3data !== undefined){
          this.chartsGen(this.data.tvl3data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvl3data: m})
        }
      }
      if(this.data.n.value === 5){
        if(this.data.tvl5data !== undefined){
          this.chartsGen(this.data.tvl5data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvl5data: m})
        }
      }
      if(this.data.n.value === 7){
        if(this.data.tvl7data !== undefined){
          this.chartsGen(this.data.tvl7data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvl7data: m})
        }
      }
      if(this.data.n.value === 14){
        if(this.data.tvl14data !== undefined){
          this.chartsGen(this.data.tvl14data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvl14data: m})
        }
      }
      if(this.data.n.value === 24){
        if(this.data.tvl24data !== undefined){
          this.chartsGen(this.data.tvl24data)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvl24data: m})
        }
      }
      if(this.data.n.value === 0){
        if(this.data.tvlmaxdata !== undefined){
          this.chartsGen(this.data.tvlmaxdata)  
        }else{
          let m = await this.getData()
          this.chartsGen(m)
          this.setdata({tvlmaxdata: m})
        }
      }
    }
  
    this.isLoading = false;
  }

  private contractsInitiate(){
    obj.forEach(contract => {
      // @ts-ignore
      contract.contractObj = new web3.eth.Contract(proxyABI, contract.add)
      if(contract.lpaddress !== undefined) {
        // @ts-ignore
        contract.lpcontractObj = new web3.eth.Contract(sushiabi, contract.lpaddress)
      }   
      return contract
    })
  }

  private getEthPrice = () => axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD')
  private getBtcPrice = () => axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=USD')

  private lpCalc(a){
    let lp1val = ((parseFloat(formatUnits(a[0][0][0], '18')))+(parseFloat(formatUnits(a[0][0][1], '18'))*this.data.ethusd))/parseFloat(formatUnits(a[0][1], '18'))
    let lp2val = ((parseFloat(formatUnits(a[1][0][0], '6')))+(parseFloat(formatUnits(a[1][0][1], '18'))*this.data.ethusd))/parseFloat(formatUnits(a[1][1], '18'))
    let lp3val = ((parseFloat(formatUnits(a[2][0][0], '18'))*this.data.ethusd)+(parseFloat(formatUnits(a[2][0][1], '6'))))/parseFloat(formatUnits(a[2][1], '18'))
    let lp4val = ((parseFloat(formatUnits(a[3][0][0], '8'))*this.data.btcusd)+(parseFloat(formatUnits(a[3][0][1], '18'))*this.data.ethusd))/parseFloat(formatUnits(a[3][1], '18'))
    let b = [lp1val, lp2val, lp3val, lp4val]

    this.setdata({ sushilpval: b })
  }

  private async getprices(){
    try {
      const [ethusd, btcusd] = await axios.all([ this.getEthPrice(), this.getBtcPrice() ])
      
      this.setdata({
        btcusd: btcusd["data"]["bitcoin"]["usd"],
        ethusd: ethusd["data"]["ethereum"]["usd"]
      })

      let slparray = obj.filter(contract => contract.native === 'slp')
      
      let promises = slparray.map(async contract => {  
            return [
              // @ts-ignore
              await contract.lpcontractObj.methods.getReserves().call({},),
              // @ts-ignore
              await contract.lpcontractObj.methods.totalSupply().call({},)
            ]               
      })
    
      const a = await Promise.all(promises) 
      
      this.lpCalc(a)
      
    }
    catch (error) {
      console.error(error)     
      return
    }
  }

  private async sharePromises(o, b){
    console.time('b')
    
    let n = this.data.n.value
    let m = this.data.m

    let promises = o.map(contract => {
      if(this.data.n.value > contract.maxHistory && this.data.n.value !== 24){
        n = contract.maxHistory
      }
      if(this.data.n.value === 0){
        n = contract.maxHistory
      }
      if(this.data.m === 'shares'){
        m = contract.contractObj.methods.getPricePerFullShare()
      }
      if(this.data.m === 'tvl'){
        m = contract.contractObj.methods.totalSupply()
      }

      return this.getPrice(contract, n, this.data.a, m, b)
    })

    try {
      const p = await Promise.all(promises)   
      
      console.timeEnd('b')
      
    return p
    } catch (error) {
      console.error(error)     
      return
    }
  }

  private async getPrice(o, n, a, m, b){
    let shares = []
    let blocks = []
      for (let i = 0; i < n; i++) {
        let block = b - (a*i)   
        shares.push(parseFloat(formatUnits(await m.call({}, block), o.decimals)).toPrecision(10))      
        blocks.push(block)          
      }  
      
      o.shareBlocks = blocks
      o.shares = shares

    return o
  }

  private chartsGen(o){
   
    let n = this.data.n.value
    let a = 0
    
    let datacharts = o.map(contract => {  
      if(this.data.n.value === 0 || this.data.n.value > contract.maxHistory){
        n = contract.maxHistory
      }  
      if(this.data.n.value === 24){
        n = 1
      } 
      
      let percent = this.percentGain(contract.shares)
      let annual = ((percent/n)*365).toPrecision(4)
      let formatPercent = this.data.m === 'shares' ? "<br> Change: " + percent.toPrecision(4) + "%" : ''
      let formatAnnual = this.data.m === 'shares' ? "<br> Annualized: " + annual + "%" : ''
      let ytitle = this.data.m === 'shares' ? '<b>y: share price</b>' : '<b>y: pool value</b>'  
      let yaxisdata = contract.shares
      
      if(this.data.c === 'usd'){
        yaxisdata = this.genUsdShares(contract, a)
        if(contract.native === 'slp'){
          a += 1
        }
      }

      return {x: contract.shareBlocks, y: yaxisdata, title: contract.title, ytitle: ytitle, percent: formatPercent, annual: formatAnnual}
    })
    
    this.setdata({ 
      charts: datacharts
    })
    this.isLoading = false;
  }

  percentGain(shares){
    return (((shares[0] - shares[shares.length - 1])/shares[shares.length - 1])*100)
  }

  genUsdShares(contract, a){
    console.log(a)
    console.log(contract)
    let usdshares = contract.shares.map(share => {
      if(contract.native === 'btc'){
        return share*this.data.btcusd
      }
      if(contract.native === 'eth'){
        return share*this.data.ethusd
      }
      if(contract.native === 'slp'){
        let r = share*this.data.sushilpval[a] 
        
        return r
      }
      
      return share
    })
      
      return usdshares
      
  }
}
