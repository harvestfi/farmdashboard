import {Network} from '@data/models/network';
import {Addresses} from './addresses';
import {Networks} from './networks';
import {APP_CONFIG} from '../../../app.config';

export class StaticValues {
  public static SECONDS_OF_DAY = 60 * 60 * 24;
  public static SECONDS_OF_MONTH = StaticValues.SECONDS_OF_DAY * 30;
  public static SECONDS_OF_WEEK = StaticValues.SECONDS_OF_DAY * 7;
  public static SECONDS_OF_YEAR = StaticValues.SECONDS_OF_DAY * 365;

  public static NETWORKS: Map<string, Network> = new Networks(APP_CONFIG).NETWORKS;

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
