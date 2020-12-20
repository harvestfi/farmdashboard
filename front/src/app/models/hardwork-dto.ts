export class HardWorkDto {
  id: string;
  vault: string;
  block: number;
  blockDate: number;
  shareChange: Date;
  shareChangeUsd: number;
  shareUsdTotal: number;
  tvl: number;
  allProfit: number;
  periodOfWork: number;
  psPeriodOfWork: number;
  perc: number;
  apr: number;
  weeklyProfit: number;
  weeklyAllProfit: number;
  psTvlUsd: number;
  psApr: number;
  farmBuyback: number;
  farmBuybackSum: number;

  blockDateAdopted: Date;

  public static fromJson(data: string): HardWorkDto {
    const jsonData = JSON.parse(data);
    const tx: HardWorkDto = new HardWorkDto();

    tx.id = jsonData.id;
    tx.vault = jsonData.vault;
    tx.block = jsonData.block;
    tx.blockDate = jsonData.blockDate;
    tx.shareChange = jsonData.shareChange;
    tx.shareChangeUsd = jsonData.shareChangeUsd;
    tx.shareUsdTotal = jsonData.shareUsdTotal;
    tx.tvl = jsonData.tvl;
    tx.allProfit = jsonData.allProfit;
    tx.periodOfWork = jsonData.periodOfWork;
    tx.psPeriodOfWork = jsonData.psPeriodOfWork;
    tx.perc = jsonData.perc;
    tx.apr = jsonData.apr;
    tx.weeklyProfit = jsonData.weeklyProfit;
    tx.weeklyAllProfit = jsonData.weeklyAllProfit;
    tx.psTvlUsd = jsonData.psTvlUsd;
    tx.psApr = jsonData.psApr;
    tx.farmBuyback = jsonData.farmBuyback;
    tx.farmBuybackSum = jsonData.farmBuybackSum;

    HardWorkDto.enrich(tx);
    return tx;
  }

  public static enrich(tx: HardWorkDto): void {
    HardWorkDto.fillBlockDateAdopted(tx);
  }

  public static fillBlockDateAdopted(tx: HardWorkDto): void {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }
}
