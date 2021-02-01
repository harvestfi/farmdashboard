import {HttpErrorResponse} from '@angular/common/http';
import {TransferDto} from '../models/transfer-dto';

export class Utils {
  public static ACTIVE_PREFIX = 'Active';
  public static BLOCKED_PREFIX = 'Blocked';
  private static loading = false;
  private static alertMessage: string;

  public static errorToText(err: HttpErrorResponse): string {
    let s = err.status + ':';
    if (err.error) {
      s += err.error.message;
    } else {
      s += err.message;
    }
    return s;
  }

  public static loadingOn(): void {
    setTimeout(() => {
      this.loading = true;
    });
  }

  public static loadingOff(): void {
    setTimeout(() => {
      this.loading = false;
    });
  }

  public static isLoading(): boolean {
    return this.loading;
  }

  public static getLoading(): boolean {
    return this.loading;
  }

  public static formatAmount(amount: string, currency: string, creditdebit: string): string {
    if (!this.isNull(amount)) {
      amount = amount.replace(',', '.');
      let n = parseFloat(amount);
      if (!this.isNull(creditdebit) && creditdebit !== '1') {
        n = -n;
      }
      if (this.isNull(currency)) {
        return this.formatNumber(n);
      } else {
        return this.formatNumber(n) + ' ' + currency;
      }
    } else {
      return '0,00';
    }
  }

  public static formatNumber(n: number, fraction: number = 2): string {
    if (n) {
      return n.toLocaleString(undefined, {
        useGrouping: true,
        minimumIntegerDigits: 1,
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction
      });
    } else {
      return '0,00';
    }
  }

  public static getAlertMessage(): string {
    return this.alertMessage;
  }

  public static setAlertMessage(m: string): void {
    this.alertMessage = m;
    setTimeout(() => {
      this.alertMessage = undefined;
    }, 5000);
  }

  public static clearStaticMessage(): void {
    this.alertMessage = undefined;
  }

  public static cardActiveColor(sintstatus: number): string {
    if (sintstatus === undefined) {
      return '';
    }

    if (sintstatus !== 11) {
      return '#be241a';
    } else {
      return '#29a623';
    }
  }

  public static cardClientStatusColor(status: string): string {
    if (status === undefined) {
      return '';
    }

    if (status.startsWith(Utils.ACTIVE_PREFIX)) {
      return '#29a623';
    } else {
      return '#be241a';
    }
  }

  public static acceptedColor(accepted: boolean): string {
    if (this.isNull(accepted)) {
      return;
    }
    if (accepted) {
      return '#29a623';
    } else {
      return '#be241a';
    }
  }

  public static isNull(o): boolean {
    return o === undefined || o === null;
  }

  public static isEmpty(s: string): boolean {
    return this.isNull(s) || s.trim() === '';
  }

  public static findInArray(array: any[], name): boolean {
    for (const el of array) {
      if (el.name === name) {
        return true;
      }
    }
    return false;
  }

  public static deleteFromArray(array: any[], el: any): any[] {
    const index = array.indexOf(el, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

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

  public static isUniLiq(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'ADD' || record.type === 'REM');
  }

  public static isUniPositive(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'BUY' || record.type === 'ADD');
  }

  public static isUniNegative(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'REM' || record.type === 'SELL');
  }

  public static isHarvest(record: any): boolean {
    return !!record.vault;
  }

  public static isHarvestPositive(record: any): boolean {
    return Utils.isHarvest(record) && record.methodName === 'Deposit';
  }

  public static isHarvestNegative(record: any): boolean {
    return Utils.isHarvest(record) && record.methodName === 'Withdraw';
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

  public static openEthersacanTx(hash: string): void {
    window.open('https://etherscan.io/tx/' + hash, '_blank');
  }

  public static openHistory(hash: string): void {
    window.open('/history/' + hash, '_blank');
  }

  public static priceGradientFarm(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type) {
        case 'ADD':
        case 'BUY':
          if (amount > 250) {
            return '#83b78c';
          } else if (amount > 100) {
            return '#8cb894';
          } else if (amount > 50) {
            return '#96ba9d';
          } else {
            return '#a1bca6';
          }
        case 'SELL':
        case 'REM':
          if (amount > 250) {
            return '#c15b5b';
          } else if (amount > 100) {
            return '#c36666';
          } else if (amount > 50) {
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
    return name === 'PS'
        || name === 'DAI_BSG'
        || name === 'DAI_BSGS'
        || name === 'SUSHI_MIC_USDT'
        || name === 'SUSHI_MIS_USDT'
        || name === 'MAAPL_UST'
        || name === 'MAAPL_UST'
        || name === 'MAMZN_UST'
        || name === 'MGOOGL_UST'
        || name === 'MTSLA_UST'
        || name === 'UNI_BAC_DAI'
        || name === 'UNI_DAI_BAS'
        ;
  }

  public static isFarmVault(name: string): boolean {
    return name.indexOf('FARM') >= 0;
  }

  public static prettifyNumber(n: number): string {
    if (n < 1000) {
      return n.toFixed(1);
    } else if (n < 1000_000) {
      return (n / 1000).toFixed(1) + 'k';
    } else if (n < 1000_000_000) {
      return (n / 1000_000).toFixed(1) + 'm';
    } else {
      return '♾️';
    }
  }
}
