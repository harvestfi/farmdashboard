import { Injectable } from '@angular/core';
import axios from 'axios';
import Web3 from 'web3';
import { proxyABI } from '../web3charts/Abi'
import type { AbiItem } from 'web3-utils'

export const web3instance = new Web3(Web3.givenProvider || "wss://eth-mainnet.ws.alchemyapi.io/v2/nzZTij_2KAavafMTicQTL52SkxJf1Lkz");

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
    
    constracts = []

    web3 = web3instance

    async init() {
        await this.contractsInitiate()
    }

    private async getContractsVaults() {
        const response = await axios.get('http://ethparser-staging.herokuapp.com/contracts/vaults');
        if (response.status === 200) {
            return response.data.data
        }
    }

    private async contractsInitiate() {
        const contracts = await this.getContractsVaults()

        this.constracts = contracts.map(item => {
            item.web3 = new this.web3.eth.Contract(proxyABI as AbiItem[], item.contract.address)
            return item
        })
    }
    
    async getCurrentBlockNumber() {
        const curBlock = await this.web3.eth.getBlockNumber()
        return curBlock
    }
}