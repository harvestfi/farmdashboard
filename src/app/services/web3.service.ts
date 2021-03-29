import { Injectable } from '@angular/core';
import axios from 'axios';
import Web3 from 'web3';
import { proxyABI, ethblocksperday, ethblocksperhour } from '../web3charts/Abi'
import { formatUnits } from "@ethersproject/units";

export const web3 = new Web3(Web3.givenProvider || "wss://eth-mainnet.ws.alchemyapi.io/v2/nzZTij_2KAavafMTicQTL52SkxJf1Lkz");

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

    constracts = [];

    ethCurrentBlock = null;

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
    }

    private async contractsInitiate() {
        const contracts = await this.getContractsVaults()

        this.constracts = contracts.map(item => {
            // @ts-ignore
            item.web3 = new web3.eth.Contract(proxyABI, item.contract.address)
            return item;
        })
    }

    async getPrice<TP extends number >(
        contractId,
        timePeriod: TP,
        blocksPeriod: typeof ethblocksperday | typeof ethblocksperhour,
        contractMethod: 'shares' | 'tvl'
    ) {
        const contract = this.constracts.find(el => el.contract.id === contractId)

        let chartData = []

        const methods = {
            shares: contract.web3.methods.getPricePerFullShare(), 
            tvl: contract.web3.methods.totalSupply(),
        }
        
        for (let i = 0; i < timePeriod; i++) {
            let block = this.ethCurrentBlock - (blocksPeriod * i);
            
            const response = await methods[contractMethod].call({}, block).catch(error => console.log(error))

            const { timestamp } = await web3.eth.getBlock(block);
            
            const value = formatUnits(response, contract.decimals)
            
            chartData.push({ block, value: Number(value), index: i, timestamp  })
        }

        return chartData;
    }
}