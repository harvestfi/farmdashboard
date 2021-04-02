import { Injectable } from '@angular/core';
import axios from 'axios';
import Web3 from 'web3';
import { proxyABI } from '../web3charts/Abi'

export const web3instance = new Web3(Web3.givenProvider || "wss://eth-mainnet.ws.alchemyapi.io/v2/nzZTij_2KAavafMTicQTL52SkxJf1Lkz");

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

    public constracts = [];

    web3 = web3instance;

    ethCurrentBlock = null;

    async init() {
        await this.contractsInitiate()
        await this.getCurrentBlock()
    }

    private async getContractsVaults() {
        const response = await axios.get('http://ethparser-staging.herokuapp.com/contracts/vaults');
        if (response.status === 200) {
            return response.data.data;
        }
    }

    private async getCurrentBlock() {
        const curBlock = await this.web3.eth.getBlockNumber()
        this.ethCurrentBlock = curBlock;
    }

    private async contractsInitiate() {
        const contracts = await this.getContractsVaults()

        this.constracts = contracts.map(item => {
            // @ts-ignore
            item.web3 = new this.web3.eth.Contract(proxyABI, item.contract.address)
            return item;
        })
    }    
}