export class TransferDto {

  id: string;
  name: string;
  block: number;
  blockDate: number;
  owner: string;
  recipient: string;
  value: number;
  balanceOwner: number;
  balanceRecipient: number;
  price: number;
  type: string;
  methodName: string;
  profit: number;
  profitUsd: number;

  blockDateAdopted: Date;

  public static fromJson(data: string): TransferDto {
    const jsonData = JSON.parse(data);
    const tx: TransferDto = new TransferDto();

    tx.id = jsonData.id;
    tx.name = jsonData.name;
    tx.block = jsonData.block;
    tx.blockDate = jsonData.blockDate;
    tx.owner = jsonData.owner;
    tx.recipient = jsonData.recipient;
    tx.value = jsonData.value;
    tx.balanceOwner = jsonData.balanceOwner;
    tx.balanceRecipient = jsonData.balanceRecipient;
    tx.price = jsonData.price;
    tx.type = jsonData.type;
    tx.methodName = jsonData.methodName;
    tx.profit = jsonData.profit;
    tx.profitUsd = jsonData.profitUsd;

    TransferDto.enrich(tx);
    return tx;
  }

  public static enrich(tx: TransferDto): void {
    TransferDto.fillBlockDateAdopted(tx);
  }

  public static fillBlockDateAdopted(tx: TransferDto): void {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }

  public static getBalanceForAddress(dto: TransferDto, address: string): number {
    if (dto.owner.toLowerCase() === address.toLowerCase()) {
      return dto.balanceOwner;
    } else if (dto.recipient.toLowerCase() === address.toLowerCase()) {
      return dto.balanceRecipient;
    } else {
      console.log('wrong balance for ', address, dto);
      return 0;
    }
  }

}
