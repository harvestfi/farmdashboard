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
    const jsonData = JSON.parse(data);
    const tx: PricesDto = new PricesDto();
    tx.id = jsonData.id;
    tx.block = jsonData.block;
    tx.blockDate = jsonData.blockDate;
    tx.network = jsonData.network;
    tx.token = jsonData.token;
    tx.tokenAmount = jsonData.tokenAmount;
    tx.otherToken = jsonData.otherToken;
    tx.otherTokenAmount = jsonData.otherTokenAmount;
    tx.price = jsonData.price;
    tx.buy = jsonData.buy;
    tx.source = jsonData.source;

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
