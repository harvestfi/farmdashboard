import { LpStat } from './lp-stat';
import { Utils } from '../static/utils';

export class HarvestDto {
  id: string;
  hash: string;
  block: number;
  confirmed: boolean;
  blockDate: number;
  network: string;
  methodName: string;
  owner: string;
  amount: number;
  amountIn: number;
  vault: string;
  vaultAddress: string;
  lastGas: number;
  lastTvl: number;
  lastUsdTvl: number;
  ownerCount: number;
  sharePrice: number;
  usdAmount: number;
  lpStat: string;
  ownerBalance: number;
  ownerBalanceUsd: number;
  allOwnersCount: number;
  allPoolsOwnersCount: number;
  underlyingPrice: number;
  profit: number;
  profitUsd: number;
  totalAmount: number;
  
  lpStatDto: LpStat;
  blockDateAdopted: Date;
  acquired: Date;
  underlyingName: string;
  
  public static fromJson(data: string): HarvestDto {
    const tx: HarvestDto = Object.assign(new HarvestDto(), JSON.parse(data));
    tx.acquired = new Date();
    HarvestDto.enrich(tx);
    return tx;
  }
  
  public static enrich(tx: HarvestDto): void {
    if (tx.acquired == null) {
      tx.acquired = new Date();
    }
    if (tx.lpStat) {
      tx.lpStatDto = JSON.parse(tx.lpStat);
    }
    HarvestDto.fillBlockDateAdopted(tx);
  }
  
  public static fillBlockDateAdopted(tx: HarvestDto): void {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }
  
  print(): string {
    // (moment(this.blockDateAdopted)).format('DD-MMM HH:mm:ss')
    return this.methodName
      + ' ' + this.usdAmount?.toFixed(2)
      + '$ ' + this.vault
      + ' TVL is ' + this.lastUsdTvl?.toFixed(2) + '$'
      ;
  }
  
  public get prettyName(): string {
    return Utils.prettyVaultName(this.vault);
  }
  
}
