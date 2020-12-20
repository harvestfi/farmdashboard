export class StaticValues {
  public static SECONDS_OF_YEAR = 31557600;
  public static lastPsApy = 0.0;
  public static psIncomeUsd = 0.0;
  public static lastPrice = 0.0;
  public static lastGas = 0;
  public static lastBlockDateAdopted = new Date(0);
  public static staked = 0.0;
  public static farmTotalSupply = 0.0;
  public static apy = 0.0;
  public static vaults: string[] = [
    'YCRV_V0',
    'WETH_V0',
    'USDC_V0',
    'USDT_V0',
    'DAI_V0',
    'WBTC_V0',
    'RENBTC_V0',
    'CRVRENWBTC_V0',
    'UNI_ETH_DAI_V0',
    'UNI_ETH_USDC_V0',
    'UNI_ETH_USDT_V0',
    'UNI_ETH_WBTC_V0',
    'UNI_ETH_DAI',
    'UNI_ETH_USDC',
    'UNI_ETH_USDT',
    'UNI_ETH_WBTC',
    'WETH',
    'USDC',
    'USDT',
    'DAI',
    'WBTC',
    'RENBTC',
    'CRVRENWBTC',
    'SUSHI_WBTC_TBTC',
    'YCRV',
    '3CRV',
    'TUSD',
    'CRV_TBTC',
    'PS',
    'CRV_CMPND',
    'CRV_BUSD',
    'CRV_USDN',
    'SUSHI_ETH_DAI',
    'SUSHI_ETH_USDC',
    'SUSHI_ETH_USDT',
    'SUSHI_ETH_WBTC',
    'IDX_ETH_DPI',
    'CRV_HUSD',
    'CRV_HBTC',
    'UNI_LP_USDC_FARM',
    'UNI_LP_WETH_FARM',
    'UNI_LP_GRAIN_FARM',
  ];

  public static strategiesListStablecoins: string[] = [
    'USDC',
    'USDT',
    'DAI',
    'TUSD',
  ];

  public static strategiesListCurve: string[] = [
    'CRV_HUSD',
    'YCRV',
    '3CRV',
    'CRV_CMPND',
    'CRV_BUSD',
    'CRV_USDN',
    'CRV_TBTC',
    'CRV_HBTC',
  ];

  public static strategiesListCrypto: string[] = [
    'PS',
    'WETH',
    'WBTC',
    'RENBTC',
    'CRVRENWBTC',
  ];

  public static strategiesListLpPools: string[] = [
    'UNI_LP_USDC_FARM',
    'UNI_LP_WETH_FARM',
    'UNI_LP_GRAIN_FARM',
    'SUSHI_ETH_DAI',
    'SUSHI_ETH_USDC',
    'SUSHI_ETH_USDT',
    'SUSHI_ETH_WBTC',
    'IDX_ETH_DPI'
  ];

  public static currentVaults: string[] = StaticValues.strategiesListStablecoins
    .concat(StaticValues.strategiesListCurve)
    .concat(StaticValues.strategiesListCrypto)
    .concat(StaticValues.strategiesListLpPools);
}
