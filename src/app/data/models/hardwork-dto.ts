export class HardWorkDto {
  id: string;
  vault: string;
  vaultAddress: string;
  block: number;
  blockDate: number;
  network: string;
  shareChange: number;
  fullRewardUsd: number;
  fullRewardUsdTotal: number;
  tvl: number;
  allProfit: number;
  periodOfWork: number;
  psPeriodOfWork: number;
  weeklyProfit: number;
  weeklyAllProfit: number;
  psTvlUsd: number;
  psApr: number;
  farmBuyback: number;
  farmBuybackSum: number;
  callsQuantity: number;
  poolUsers: number;
  savedGasFees: number;
  savedGasFeesSum: number;
  fee: number;
  weeklyAverageTvl: number;
  farmBuybackEth: number;
  feeEth: number;
  gasUsed: number;
  idleTime: number;
  invested: number;
  investmentTarget: number;
  farmPrice: number;
  ethPrice: number;
  profitSharingRate: number;
  buyBackRate: number;
  autoStake: number;
  
  blockDateAdopted: Date;
  
  public static fromJson(data: string): HardWorkDto {
    const tx: HardWorkDto = Object.assign(new HardWorkDto(), JSON.parse(data));
    HardWorkDto.enrich(tx);
    return tx;
  }
  
  public static enrich(tx: HardWorkDto): void {
    HardWorkDto.fillBlockDateAdopted(tx);
  }
  
  public static fillBlockDateAdopted(tx: HardWorkDto): void {
    if (tx && tx?.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }
}
