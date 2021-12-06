import { Utils } from '@data/static/utils';

export class UniswapDto {
  id: string;
  type: string;
  owner: string;
  coin: string;
  coinAddress: string;
  amount: number;
  otherCoin: string;
  otherCoinAddress: string;
  otherAmount: number;
  hash: string;
  block: string;
  confirmed: boolean;
  lastPrice: number;
  lastGas: number;
  blockDate: number;
  methodName: string;
  lp: string;
  lpAddress: string;

  blockDateAdopted: Date;

  public static fromJson(data: string): UniswapDto {
    const tx: UniswapDto = Object.assign(new UniswapDto(), JSON.parse(data));
    UniswapDto.round(tx);
    return tx;
  }

  public static round(tx: UniswapDto): void {
    tx.amount = Number(tx.amount?.toFixed(2));
    tx.otherCoin = tx.otherCoin?.substring(0, 6);
    tx.otherAmount = Number(tx.otherAmount?.toFixed(2));
    tx.lastPrice = Number(tx.lastPrice?.toFixed(2));
    tx.lastGas = Number(tx.lastGas?.toFixed(0));
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }

  print(): string {
    // (moment(this.blockDateAdopted)).format('HH:mm:ss')
    return Utils.prettyTransactionType(this.type)
        + ' ' + this.amount?.toFixed(2)
        + ' ' + this.coin
        + ' for ' + this.otherAmount?.toFixed(2)
        + ' ' + this.otherCoin
        + ' price ' + this.lastPrice?.toFixed(2)
        ;
  }

}
