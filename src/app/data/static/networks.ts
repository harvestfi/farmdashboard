import {Network} from '@data/models/network';
import {APP_CONFIG} from '../../../app.config';
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Networks {
  private static NETWORK_ETH: Network = {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: 1,
    ethparserName: 'eth',
    currencySymbol: 'ETH',
    name: 'Ethereum Mainnet',
    etherscanUrl: 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken',
  };

  private static NETWORK_BSC: Network = {
    blockExplorerUrl: 'https://www.bscscan.com',
    chainId: 56,
    ethparserName: 'bsc',
    currencySymbol: 'BNB',
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  };

  private static NETWORK_MATIC: Network = {
    blockExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
    chainId: 137,
    ethparserName: 'matic',
    currencySymbol: 'Matic',
    name: 'Matic',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com/',
  };


  public NETWORKS: Map<string, Network> = new Map<string, Network>([
    ['bsc', Networks.NETWORK_BSC],
    ['eth', Networks.NETWORK_ETH],
    ['matic', Networks.NETWORK_MATIC],
  ]);

  constructor(@Inject(APP_CONFIG)config) {
    this.NETWORKS.set('eth', this.makeEthNetwork(config.ethRpcUrl));
  }

  private makeEthNetwork(rpcUrl: string): Network {
    return {
      blockExplorerUrl: 'https://etherscan',
      chainId: 1,
      ethparserName: 'eth',
      name: 'Ethereum Mainnet',
      currencySymbol: 'ETH',
      rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/your_key',
    };
  }

}
