// todo should be replaced with contract endpoint
export class Addresses {
  // lp
  public static UNI_LP_USDC_FARM = '0x514906fc121c7878424a5c928cad1852cc545892'.toLowerCase();
  public static UNI_LP_WETH_FARM = '0x56feaccb7f750b997b36a68625c7c596f0b41a58'.toLowerCase();
  public static UNI_LP_GRAIN_FARM = '0xb9fa44b0911f6d777faab2fa9d8ef103f25ddf49'.toLowerCase();

  // vaults
  public static WETH = '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e'.toLowerCase();
  public static USDC = '0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE'.toLowerCase();
  public static USDT = '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C'.toLowerCase();
  public static DAI = '0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C'.toLowerCase();
  public static WBTC = '0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB'.toLowerCase();
  public static RENBTC = '0xC391d1b08c1403313B0c28D47202DFDA015633C4'.toLowerCase();
  public static CRVRENWBTC = '0x9aA8F427A17d6B0d91B6262989EdC7D45d6aEdf8'.toLowerCase();
  public static YCRV = '0x0FE4283e0216F94f5f9750a7a11AC54D3c9C38F3'.toLowerCase();
  public static TUSD = '0x7674622c63Bee7F46E86a4A5A18976693D54441b'.toLowerCase();
  public static CRV_TBTC = '0x640704D106E79e105FDA424f05467F005418F1B5'.toLowerCase();
  public static PS = '0x25550Cccbd68533Fa04bFD3e3AC4D09f9e00Fc50'.toLowerCase();
  public static PS_V0 = '0x59258F4e15A5fC74A7284055A8094F58108dbD4f'.toLowerCase();
  public static CRV_CMPND = '0x998cEb152A42a3EaC1f555B1E911642BeBf00faD'.toLowerCase();
  public static CRV_BUSD = '0x4b1cBD6F6D8676AcE5E412C78B7a59b4A1bbb68a'.toLowerCase();
  public static CRV_USDN = '0x683E683fBE6Cf9b635539712c999f3B3EdCB8664'.toLowerCase();
  public static CRV_HUSD = '0x29780C39164Ebbd62e9DDDE50c151810070140f2'.toLowerCase();
  public static CRV_HBTC = '0xCC775989e76ab386E9253df5B0c0b473E22102E2'.toLowerCase();

  public static mapAddressToName(address: string): string {
    let result = address;
    Object.getOwnPropertyNames(Addresses).forEach(name => {
      if (Addresses[name] === address) {
        result = name;
        return;
      }
    });
    return result;
  }
}
