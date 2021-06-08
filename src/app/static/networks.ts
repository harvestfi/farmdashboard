import {Network} from '../models/network';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Networks {

  private static NETWORK_ETH: Network ={
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
  public NETWORKS: Map<string, Network> = new Map<string, Network>([
    ['bsc', Networks.NETWORK_BSC],
    ['eth', Networks.NETWORK_ETH]
  ]);
}
