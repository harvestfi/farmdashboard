import { Injectable } from '@angular/core';
import axios from 'axios';
import Web3 from 'web3';
import {proxyABI, sushiabi, ethblocksperday, ethblocksperhour} from '../statistic-board/Abi'
import { formatUnits } from "@ethersproject/units";

export const web3 = new Web3(Web3.givenProvider || "wss://eth-mainnet.ws.alchemyapi.io/v2/nzZTij_2KAavafMTicQTL52SkxJf1Lkz");

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
    
    isLoading = false;

    constracts = [];

    ethCurrentBlock = null;

    data = {
        btcusd: null,
        ethusd: null,
    }

    cache = {}

    setData(data) {
        this.data = {
            ...this.data,
            ...data,
        }
    }

    async init() {
        await this.contractsInitiate()
        // await this.getprices();
        await this.getCurrentBlock()
    }

    private async getContractsVaults() {
        const response = await axios.get('http://ethparser-staging.herokuapp.com/contracts/vaults');
        if (response.status === 200) {
            return response.data.data;
        }
    }

    private async getCurrentBlock() {
        const curBlock = await web3.eth.getBlockNumber()
        this.ethCurrentBlock = curBlock;
        // console.log('ethblocksperday', ethblocksperday)
        // console.log('curBlock', curBlock)
    }

    private async contractsInitiate() {
        const contracts = await this.getContractsVaults()

        this.constracts = contracts.map(item => {
            // @ts-ignore
            // contractObj.methods.getPricePerFullShare() shares
            // contractObj.methods.totalSupply() tvl
            item.web3 = new web3.eth.Contract(proxyABI, item.contract.address)
            return item;
        })

        console.log('- - - - this.constracts', this.constracts);
    }
     
    async getPrice<TP extends number>(
        contractId,
        timePeriod: TP,
        blocksPeriod: typeof ethblocksperday | typeof ethblocksperhour,
        contractMethod: 'shares' | 'tvl'
    ) {
        const contract = this.constracts.find(el => el.contract.id === contractId)
        
        console.log('contract', {
            contractId,
            contract,
            timePeriod,
            blocksPeriod,
            contractMethod,
        })

        let chartData = []

        const methods = {
            shares: contract.web3.methods.getPricePerFullShare(), 
            tvl: contract.web3.methods.totalSupply(),
        }

        for (let i = 0; i < timePeriod; i++) {
            let block = this.ethCurrentBlock - (blocksPeriod * i);
            const response = await methods[contractMethod].call({}, block)

            const share = parseFloat(formatUnits(response, contract.decimals)).toPrecision(10)
                
            chartData.push({ block, share, index: i  })
        }

        contract.chartData = chartData;

        return contract;
    }

    genUsdShares(contract, ) {

    }

    chartsGen() {

    }

    // private getEthPrice = () => axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD')
    
    // private getBtcPrice = () => axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=USD')
  
    // private async getprices(){
    //     const [ethusd, btcusd] = await axios.all([ this.getEthPrice(), this.getBtcPrice() ])
          
    //     this.setData({
    //         btcusd: btcusd["data"]["bitcoin"]["usd"],
    //         ethusd: ethusd["data"]["ethereum"]["usd"]
    //     })
    // }
}