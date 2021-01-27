export class UniswapDto {
  id: string;
  type: string;
  owner: string;
  coin: string;
  amount: number;
  otherCoin: string;
  otherAmount: number;
  ethAmount: number;
  hash: string;
  block: string;
  confirmed: boolean;
  lastPrice: number;
  lastGas: number;
  blockDate: number;
  psWeekApy: number;
  psIncomeUsd: number;
  ownerCount: number;
  ownerBalance: number;
  ownerBalanceUsd: number;
  methodName: string;

  acquired: Date;
  blockDateAdopted: Date;

  public static fromJson(data: string): UniswapDto {
    const jsonData = JSON.parse(data);
    const tx: UniswapDto = new UniswapDto();
    tx.id = jsonData.id;
    tx.type = jsonData.type;
    tx.owner = jsonData.owner;
    tx.coin = jsonData.coin;
    tx.amount = jsonData.amount;
    tx.otherCoin = jsonData.otherCoin;
    tx.otherAmount = jsonData.otherAmount;
    tx.ethAmount = jsonData.ethAmount;
    tx.hash = jsonData.hash;
    tx.block = jsonData.block;
    tx.confirmed = jsonData.confirmed;
    tx.lastPrice = jsonData.lastPrice;
    tx.lastGas = jsonData.lastGas;
    tx.blockDate = jsonData.blockDate;
    tx.psWeekApy = jsonData.psWeekApy;
    tx.psIncomeUsd = jsonData.psIncomeUsd;
    tx.ownerCount = jsonData.ownerCount;
    tx.ownerBalance = jsonData.ownerBalance;
    tx.ownerBalanceUsd = jsonData.ownerBalanceUsd;
    tx.methodName = jsonData.methodName;

    tx.acquired = new Date();
    UniswapDto.round(tx);
    return tx;
  }

  public static round(tx: UniswapDto): void {
    tx.amount = Number(tx.amount?.toFixed(2));
    tx.otherCoin = tx.otherCoin?.substring(0, 6);
    tx.otherAmount = Number(tx.otherAmount?.toFixed(2));
    tx.lastPrice = Number(tx.lastPrice?.toFixed(2));
    tx.lastGas = Number(tx.lastGas?.toFixed(0));
    if (tx.acquired == null) {
      tx.acquired = new Date();
    }
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }

  print(): string {
    // (moment(this.blockDateAdopted)).format('HH:mm:ss')
    return this.typeToString()
        + ' ' + this.amount
        + ' ' + this.coin
        + ' for ' + this.otherAmount
        + ' ' + this.otherCoin
        + ' price ' + this.lastPrice
        ;
  }

  typeToString(): string {
    switch (this.type) {
      case 'BUY':
        return 'Buy';
      case 'SELL':
        return 'Sell';
      case 'ADD':
        return 'Add liquidity';
      case 'REM':
        return 'Remove liquidity';
    }
  }
}
