export class StaticValues {
  public static SECONDS_OF_YEAR = 31557600;
  public static SECONDS_OF_DAY = 60 * 60 * 24;
  public static uniInited = false;
  public static lastPsApy = 0.0;
  public static psIncomeUsd = 0.0;
  public static lastPrice = 0.0;
  public static lastGas = 0;
  public static lastBlockDateAdopted = new Date(0);
  public static staked = 0.0;
  public static farmTotalSupply = 0.0;
  public static apy = 0.0;
  public static farmUsers = 0;
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
    'PS_V0',
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
    'UNI_BAC_DAI',
    'UNI_DAI_BAS',
    'SUSHI_MIC_USDT',
    'SUSHI_MIS_USDT'
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
    'IDX_ETH_DPI',
    'UNI_BAC_DAI',
    'UNI_DAI_BAS',
    'SUSHI_MIC_USDT',
    'SUSHI_MIS_USDT'
  ];

  public static farmPools: string[] = [
    'UNI_LP_USDC_FARM',
    'UNI_LP_WETH_FARM',
    'UNI_LP_GRAIN_FARM'
  ];

  public static currentVaults: string[] = StaticValues.strategiesListStablecoins
  .concat(StaticValues.strategiesListCurve)
  .concat(StaticValues.strategiesListCrypto)
  .concat(StaticValues.strategiesListLpPools);

  public static vaultPrettyName(name: string): string {
    return name?.replace('SUSHI_', '')
    .replace('UNI_LP_', '')
    .replace('UNI_', '')
    .replace('ST_', '')
        ;
  }

  public static getImgSrcForVault(name: string): string {
    switch (name) {
      case 'UNI_ETH_DAI_V0':
      case 'UNI_ETH_DAI':
        return '/assets/icons/eth_dai.png';
      case 'UNI_ETH_USDC_V0':
      case 'UNI_ETH_USDC':
        return '/assets/icons/eth_usdc.png';
      case 'UNI_ETH_USDT_V0':
      case 'UNI_ETH_USDT':
        return '/assets/icons/eth_usdt.png';
      case 'UNI_ETH_WBTC_V0':
      case 'UNI_ETH_WBTC':
        return '/assets/icons/eth_btc.svg';
      case 'WETH_V0':
      case 'WETH':
      case 'ETH':
        return '/assets/icons/eth.png';
      case 'USDC_V0':
      case 'USDC':
        return '/assets/icons/usdc.png';
      case 'USDT_V0':
      case 'USDT':
        return '/assets/icons/usdt.png';
      case 'DAI_V0':
      case 'DAI':
        return '/assets/icons/dai.png';
      case 'WBTC_V0':
      case 'WBTC':
        return '/assets/icons/wbtc.png';
      case 'RENBTC_V0':
      case 'RENBTC':
        return '/assets/icons/ren.png';
      case 'CRVRENWBTC_V0':
      case 'CRVRENWBTC':
        return '/assets/icons/btc.png';
      case 'SUSHI_WBTC_TBTC':
        return '/assets/icons/sushi_tbtc.png';
      case 'WBTC_TBTC':
        return '/assets/icons/sushi_tbtc.png';
      case 'YCRV_V0':
      case 'YCRV':
        return '/assets/icons/curve.png';
      case '3CRV':
      case '_3CRV':
        return '/assets/icons/three-pool.png';
      case 'TUSD':
        return '/assets/icons/tusd.png';
      case 'ST_PS_V0':
      case 'PS_V0':
      case 'PS':
      case 'FARM':
        return '/assets/icons/farm.png';
      case 'CRV_TBTC':
        return '/assets/icons/tbtc-mixed.png';
      case 'CRV_CMPND':
        return '/assets/icons/curve-compound.png';
      case 'CRV_BUSD':
        return '/assets/icons/curve-busd.png';
      case 'CRV_USDN':
        return '/assets/icons/curve-usdn.png';
      case 'SUSHI_ETH_DAI':
        return '/assets/icons/sushi-dai.png';
      case 'SUSHI_ETH_USDC':
        return '/assets/icons/sushi-usdc.png';
      case 'SUSHI_ETH_USDT':
        return '/assets/icons/sushi-usdt.png';
      case 'SUSHI_ETH_WBTC':
        return '/assets/icons/sushi-wbtc.png';
      case 'IDX_ETH_DPI':
        return '/assets/icons/eth_dpi.png';
      case 'CRV_HUSD':
        return '/assets/icons/curve-husd.png';
      case 'CRV_HBTC':
        return '/assets/icons/curve-hbtc.png';
      case 'UNI_LP_USDC_FARM':
        return '/assets/icons/farm-usdc.png';
      case 'UNI_LP_WETH_FARM':
        return '/assets/icons/farm-weth.png';
      case 'UNI_LP_GRAIN_FARM':
        return '/assets/icons/corn.svg';
      case 'UNI_BAC_DAI':
        return '/assets/icons/bac-dai.png';
      case 'UNI_DAI_BAS':
        return '/assets/icons/dai-bas.png';
      case 'SUSHI_MIC_USDT':
      case 'MIC_USDT':
        return '/assets/icons/mic-usdt.png';
      case 'SUSHI_MIS_USDT':
      case 'MIS_USDT':
        return '/assets/icons/mis-usdt.png';
    }
  }
}
