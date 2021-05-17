import {Network} from '../models/network';
import {Addresses} from './addresses';

export class StaticValues {
  public static SECONDS_OF_DAY = 60 * 60 * 24;
  public static SECONDS_OF_MONTH = StaticValues.SECONDS_OF_DAY * 30;
  public static SECONDS_OF_WEEK = StaticValues.SECONDS_OF_DAY * 7;
  public static SECONDS_OF_YEAR = StaticValues.SECONDS_OF_DAY * 365;

  private static NETWORK_ETH: Network = {
    blockExplorerUrl: 'https://www.bscscan.com',
    chainId: 1,
    ethparserName: 'eth',
    currencySymbol: 'ETH',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/undefined',
  };
  private static NETWORK_BSC: Network = {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: 56,
    ethparserName: 'bsc',
    currencySymbol: 'BNB',
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  };
  public static NETWORKS: Map<string, Network> = new Map<string, Network>([
    ['eth', StaticValues.NETWORK_ETH],
    ['bsc', StaticValues.NETWORK_BSC]
  ]);

  public static NETWORK_ICON: Map<string, string> = new Map<string, string>([
    ['eth', 'assets/icons/common/eth.svg'],
    ['bsc', 'assets/icons/common/wbnb.png']
  ]);

  public static farmPools: string[] = [
    Addresses.ADDRESSES.get('UNI_LP_USDC_FARM'),
    Addresses.ADDRESSES.get('UNI_LP_WETH_FARM'),
    Addresses.ADDRESSES.get('UNI_LP_GRAIN_FARM')
  ];

  public static PS_VAULTS: Set<string> = new Set<string>([
    Addresses.ADDRESSES.get('PS_V0'),
    Addresses.ADDRESSES.get('PS'),
    Addresses.ADDRESSES.get('iPS'),
  ]);

  public static isStableCoin(address: string): boolean {
    switch (address.toLowerCase()) {
      case Addresses.ADDRESSES.get('USDC'):
      case Addresses.ADDRESSES.get('BUSD'):
      case Addresses.ADDRESSES.get('USDT'):
        return true;
      default:
        return false;
    }
  }
}
