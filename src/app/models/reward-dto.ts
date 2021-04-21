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
  network: string;

  blockDateAdopted: Date;

  public static fromJson(data: string): RewardDto {
    const tx: RewardDto = new RewardDto();
    Object.assign(tx, JSON.parse(data));

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
