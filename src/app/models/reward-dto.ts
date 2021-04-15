export class RewardDto {
  id: string;
  vault: string;
  block: number;
  blockDate: number;
  reward: number;
  periodFinish: number;
  apy: number;
  weeklyApy: number;
  tvl: number;
  farmBalance: number;

  blockDateAdopted: Date;

  public static fromJson(data: string): RewardDto {
    const jsonData = JSON.parse(data);
    const tx: RewardDto = new RewardDto();

    tx.id = jsonData.id;
    tx.vault = jsonData.vault;
    tx.block = jsonData.block;
    tx.blockDate = jsonData.blockDate;
    tx.reward = jsonData.reward;
    tx.periodFinish = jsonData.periodFinish;
    tx.apy = jsonData.apy;
    tx.weeklyApy = jsonData.weeklyApy;
    tx.tvl = jsonData.tvl;
    tx.farmBalance = jsonData.farmBalance;

    RewardDto.enrich(tx);
    return tx;
  }

  public static enrich(tx: RewardDto): RewardDto {
    return RewardDto.fillBlockDateAdopted(tx);
  }

  public static fillBlockDateAdopted(tx: RewardDto): RewardDto {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
    return tx;
  }
}
