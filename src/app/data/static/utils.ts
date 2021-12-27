import {TransferDto} from '@data/models/transfer-dto';
import {Addresses} from './addresses';
import { Contract } from '@data/models/contract';
import { vaultNames } from '@data/static/vault-names';

export class Utils {
  public static aprToApyEveryDayReinvest(apr: number): number {
    if (!apr || apr === 0.0) {
      return 0.0;
    }
    return Utils.aprToApy(apr, 365);
  }

  public static aprToApy(apr: number, period: number): number {
    return (Math.pow(1.0 + ((apr / 100) / period), period) - 1.0) * 100;
  }

  public static isUni(record: any): boolean {
    return !!record.type;
  }

  public static isTransfer(record: any): boolean {
    return !!record.recipient;
  }

  public static isTransferPositive(record: any, address: string): boolean {
    return Utils.isTransfer(record) && record.recipient.toLowerCase() === address.toLowerCase();
  }

  public static isUniTrade(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'BUY' || record.type === 'SELL');
  }

  public static isUniPositive(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'BUY' || record.type === 'ADD');
  }

  public static isHarvest(record: { vault: string }): boolean {
    return !!record.vault;
  }

  public static isHarvestPositive(record: { vault: string; methodName: string }): boolean {
    return Utils.isHarvest(record) && record.methodName === 'Deposit';
  }

  public static transferBalance(t: TransferDto, address: string): number {
    if (address.toLowerCase() === t.owner.toLowerCase()) {
      return t.balanceOwner;
    } else if (address.toLowerCase() === t.recipient.toLowerCase()) {
      return t.balanceRecipient;
    }
    return 0;
  }

  public static transferBalanceUsd(t: TransferDto, address: string): number {
    return Utils.transferBalance(t, address) * t.price;
  }

  public static openNetworkScanTx(hash: string, network: string): void {
    window.open(this.getNetworkScanUrl(network) + '/tx/' + hash, '_blank');
  }

  public static openHistory(hash: string): void {
    window.open('/history/' + hash, '_blank');
  }

  public static priceGradientHarvest(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type.toLowerCase()) {
        case 'deposit':
          if (amount > 1000000) {
            return '#83b78c';
          } else if (amount > 200000) {
            return '#8cb894';
          } else if (amount > 50000) {
            return '#96ba9d';
          } else {
            return '#a1bca6';
          }
        case 'withdraw':
          if (amount > 1000000) {
            return '#c15b5b';
          } else if (amount > 200000) {
            return '#c36666';
          } else if (amount > 50000) {
            return '#c47272';
          } else {
            return '#c37d7d';
          }
      }
    } else {
      return '#474646';
    }
    return '#ffffff';
  }

  public static prettyTransferType(type: string): string {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'COMMON':
        return 'Transfer';
      case 'LP_SELL':
        return 'Sell';
      case 'LP_BUY':
        return 'Buy';
      case 'REWARD':
        return 'Reward';
      case 'PS_STAKE':
        return 'PS Stake';
      case 'PS_EXIT':
        return 'PS Exit';
      case 'ONE_INCH':
        return '1Inch';
      case 'ZERO_X':
        return 'ZeroX';
    }
    return type;
  }

  public static isAutoStakeVault(name: string): boolean {
    switch (name) {
      case Addresses.ADDRESSES.get('PS'):
        return true;
    }
    return false;
  }

  public static prettifyNumber(n: number): string {
    if (n < 1000) {
      return n.toFixed(1);
    } else if (n < 1000_000) {
      return (n / 1000).toFixed(1) + 'k';
    } else if (n < 1000_000_000) {
      return (n / 1000_000).toFixed(1) + 'm';
    } else if (n < 1000_000_000_000) {
      return (n / 1000_000_000).toFixed(1) + 'g';
    } else {
      return '♾️';
    }
  }

  public static iterableReduce(arr: IterableIterator<any>, mapper = a => a): number {
    if (!arr) {
      return 0;
    }
    return Array.from(arr)
    .filter(a => !!a)
    .map(mapper)
    .reduce((n, p) => n + p, 0);
  }

  public static prettyVaultName(name: string): string {
    name = name.replace('V_', '');
    let postfix = '';
    if (!!name && name.split('_#').length === 2) {
      postfix = '_' + name.split('_#')[1];
      name = name.split('_#')[0];
    }
    switch (name) {
      case 'CRV_YDAI_YUSDC_YUSDT_YTUSD':
        name = 'YCRV';
        break;
      case 'yDAI_yUSDC_yUSDT_yBUSD':
      case 'CRV_yDAI_yUSDC_yUSDT_yBUSD':
        name = 'CRV_BUSD';
        break;
      case 'BELT_bDAI_bUSDC_bUSDT_bBUSD':
        name = 'BELT_BUSD';
        break;
      case 'CRV_yDAI_yUSDC_yUSDT_yTUSD':
        name = 'CRV_TUSD';
        break;
      case 'CRV_oBTC_sbtcCRV':
        name = 'CRV_sBTC';
        break;
    }

    if (name.split('_').length >= 3) {
      name = name.replace('ONEINCH_', '')
      .replace('1INCH_', '')
      .replace('SUSHI_', '')
      .replace('UNI_', '')
      .replace('PCS_', '')
      ;
    }
    return name.replace('ONEINCH', '1INCH') + postfix;
  }

  public static addInMap(map: Map<any, number>, key: any, value: number): void {
    if (!!value
        && value.toString() !== 'NaN'
        && value !== 0) {
      map.set(key, value);
    }
  }

  public static addInArrayAtTheStart<T>(arr: T[], el: T, max: number = 100): void {
    arr.unshift(el);
    if (arr.length > max) {
      arr.pop();
    }
  }

  public static getNetworkScanUrl(network: string): string {
    if (network === 'bsc') {
      return 'https://bscscan.com';
    } else {
      return 'https://etherscan.io';
    }
  }
  
  public static contractToName(contract?: Contract): string {
    if (!contract) return 'no name';
    return vaultNames[contract.address] || contract.name || 'no name';
  }
  
  public static prettyCurrency = (
    balance: number,
    currency: string,
    exchangeRate: number,
  ) => {
    return Utils.currencyFormatter(currency).format(balance * exchangeRate);
  };
  
  public static prettyNumber(number: number) {
    return Utils.numberFormatter().format(number);
  }
  
  private static currencyFormatter(currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    });
  }
  
  private static numberFormatter() {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });
  }
}
