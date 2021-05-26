import {Injectable} from '@angular/core';
import {InfuraService} from '../http/infura.service';
import {PricesService} from '../http/prices.service';
import {Observable, Subscriber} from 'rxjs';
import {Networks} from '../../static/networks';

@Injectable({
    providedIn: 'root'
})
export class BlockDiffService {

    private subscribers: Subscriber<{network: string;blockNum: number}>[] = [];
    private networks = new Map<string,Map<string, number>>();

    constructor(private infuraService: InfuraService, private pricesService: PricesService, networks: Networks) {
        networks.NETWORKS.forEach((v,k) => this.networks.set(k, new Map()));
        this.pricesService.subscribeToPrices().subscribe(price => {
            this.networks.set(price.network, this.networks.get(price.network).set('ethparser', price.block));
            this.publishDiff(price.network);
        });

        Array.from(networks.NETWORKS.keys()).forEach(network =>
            this.infuraService.getLastBlock(networks.NETWORKS.get(network)).subscribe(blockNum => {
                this.networks.set(network, this.networks.get(network).set('infura', blockNum));
                this.publishDiff(network);
            })
        );
    }

    private publishDiff(network: string){
        const infura = this.networks.get(network).get('infura')||0;
        const ethparser = this.networks.get(network).get('ethparser')||0;
        this.subscribers.forEach(s => {
            s.next({network, blockNum: Math.max(0, infura-ethparser)});
        });
    }

    subscribeToBlockNumbers(): Observable<{network: string;blockNum: number}>{
        return new Observable((subscriber) => {
            this.subscribers.push(subscriber);
        });
    }

}
