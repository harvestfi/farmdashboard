import {Network} from '../models/network';

export class StaticValues {
  public static SECONDS_OF_DAY = 60 * 60 * 24;
  public static SECONDS_OF_MONTH = StaticValues.SECONDS_OF_DAY * 30;
  public static SECONDS_OF_WEEK = StaticValues.SECONDS_OF_DAY * 7;
  public static SECONDS_OF_YEAR = StaticValues.SECONDS_OF_DAY * 365;
  public static uniInited = false;
  public static lastPrice = 0.0;
  public static lastGas = 0;
  public static lastBlockDateAdopted = new Date(0);
  public static staked = 0.0;
  public static stakedNewPS = 0.0;
  public static farmTotalSupply = 0.0;
  public static farmUsers = 0;

  private static NETWORK_ETH: Network = {
    blockExplorerUrl: 'https://www.bscscan.com',
    chainId: 1,
    currencySymbol: 'ETH',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/undefined',
    ethparserName: 'eth'
  };
  private static NETWORK_BSC: Network = {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: 56,
    currencySymbol: 'BNB',
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    ethparserName: 'bsc'
  };
  public static NETWORKS: Map<string, Network> = new Map<string, Network>([
    ['eth', StaticValues.NETWORK_ETH],
    ['bsc', StaticValues.NETWORK_BSC]
  ]);

  public static farmPools: string[] = [
    'UNI_LP_USDC_FARM',
    'UNI_LP_WETH_FARM',
    'UNI_LP_GRAIN_FARM'
  ];

  public static isPS: Set<string> = new Set<string>([
    'PS_V0',
    'PS',
    'iPS',
  ]);

  public static mapCoinNameToSimple(name: string): string {
    switch (name) {
      case 'CRV_STETH':
      case 'WETH':
      case 'ZERO': // 1inch stubbing
        return 'ETH';
      case 'RENBTC':
      case 'CRVRENWBTC':
      case 'WBTC':
      case 'CRV_TBTC':
      case 'CRV_HBTC':
      case 'CRV_OBTC':
        return 'BTC';
      case 'CRV_EURS':
        return 'EURS';
      case 'PS_V0':
      case 'PS':
      case 'iPS':
        return 'FARM';
      case 'CRV_LINK':
        return 'LINK';
      case 'SUSHI_HODL':
        return 'SUSHI';
    }
    return name;
  }

  public static isStableCoin(name: string): boolean {
    return 'USD' === name
        || 'USDC' === name
        || 'USDT' === name
        || 'YCRV' === name
        || '3CRV' === name
        || 'TUSD' === name
        || 'DAI' === name
        || 'CRV_CMPND' === name
        || 'CRV_BUSD' === name
        || 'CRV_USDN' === name
        || 'CRV_HUSD' === name
        || 'UST_NAME' === name
        || 'CRV_UST' === name
        || 'UST' === name
        || 'CRV_GUSD' === name
        || 'CRV_AAVE' === name
        ;
  }
}
