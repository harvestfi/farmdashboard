import { HttpService } from './http.service'
import { Injectable } from '@angular/core'
import Web3 from 'web3';
import { proxyABI } from '../web3charts/Abi'
import type { ContractVault } from '../models/contract-valut'
import type { AbiItem } from 'web3-utils'
import type { Contract } from 'web3-eth-contract';

export const web3instance = new Web3(Web3.givenProvider || "wss://eth-mainnet.ws.alchemyapi.io/v2/nzZTij_2KAavafMTicQTL52SkxJf1Lkz");

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
    web3 = web3instance

    constracts: (ContractVault & { web3: Contract })[] = []

    constructor(
        private httpService: HttpService,
    ) {}

    init(): Promise<void> {
        return this.contractsInitiate()
    }

    private getContractsVaults(): Promise<ContractVault[]> {
        return new Promise((resolve, reject) => {
            this.httpService.getContractsVaults().subscribe(response => {
                if (response.code === '200') {
                    resolve(response.data)
                } else {
                    reject()
                }
            })
        })
    }

    private contractsInitiate(): Promise<void> {        
        return this.getContractsVaults().then(contracts => {
            this.constracts = contracts.map(item => {
                const web3 = new this.web3.eth.Contract(proxyABI as AbiItem[], item.contract.address)
                return Object.assign(item, { web3 })
            })
        })
    }
     
    getCurrentBlockNumber(): Promise<number> {
        return this.web3.eth.getBlockNumber()
    }
}