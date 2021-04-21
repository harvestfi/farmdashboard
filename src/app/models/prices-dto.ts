export class PricesDto {
  id: string;
  block: number;
  blockDate: number;
  network: string;
  token: string;
  tokenAmount: number;
  otherToken: string;
  otherTokenAmount: number;
  price: number;
  buy: boolean;
  source: string;

  blockDateAdopted: Date;

  public static fromJson(data: string): PricesDto {
    const tx: PricesDto = new PricesDto();
    Object.assign(tx, JSON.parse(data));
    PricesDto.fillBlockDateAdopted(tx);
    return tx;
  }

  public static fillBlockDateAdopted(tx: PricesDto): void {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }
}
