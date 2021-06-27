import {Injectable} from '@angular/core';
import {RpcService} from '../http/rpc.service';
import {PricesService} from '../http/prices.service';
import {Observable, Subscriber} from 'rxjs';
import {Networks} from '@data/static/networks';

@Injectable({
  providedIn: 'root'
})
export class BlockDiffService {

  private subscribers: Subscriber<{ network: string; blockNum: number }>[] = [];
  private networks = new Map<string, Map<string, number>>();

  constructor(private rpcService: RpcService, private pricesService: PricesService, networks: Networks) {
    networks.NETWORKS.forEach((v, k) => this.networks.set(k, new Map()));
    this.pricesService.subscribeToPrices().subscribe(price => {
      this.networks.set(price.network, this.networks.get(price.network).set('ethparser', price.block));
      this.publishDiff(price.network);
    });

    Array.from(networks.NETWORKS.keys()).forEach(network =>
        this.rpcService.getLastBlock(networks.NETWORKS.get(network)).subscribe(blockNum => {
          this.networks.set(network, this.networks.get(network).set('rpc', blockNum));
          this.publishDiff(network);
        })
    );
  }

  private publishDiff(network: string): void {
    const web3 = this.networks.get(network).get('rpc') || 0;
    const ethparser = this.networks.get(network).get('ethparser') || 0;
    if (ethparser === 0) {
      return;
    }
    this.subscribers.forEach(s => {
      s.next({network, blockNum: Math.max(0, web3 - ethparser)});
    });
  }

  subscribeToBlockNumbers(): Observable<{ network: string; blockNum: number }> {
    return new Observable((subscriber) => {
      this.subscribers.push(subscriber);
    });
  }

}
