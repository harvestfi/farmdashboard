export class BancorDto {
    id: string;
    block: string;
    blockDate: number;
    amount: number;
    type: string;
    lastPrice: number;
    owner: string;
    amountBnt: number;
    amountFarm: number;
    farmAsSource: boolean;
    priceBnt: number;
    priceFarm: number;
    coinAddress: string;
    tokenAddress: string;

    blockDateAdopted: Date;

    public static fromJson(data: string): BancorDto {
        const tx: BancorDto = Object.assign(new BancorDto(), JSON.parse(data));
        BancorDto.enrich(tx);
        return tx;
    }

    public static enrich(tx: BancorDto): BancorDto {
        return BancorDto.fill(tx);
    }

    public static fill(tx: BancorDto): BancorDto {
        if (tx.blockDateAdopted == null) {
            const d = new Date(0);
            d.setUTCSeconds(tx.blockDate);
            tx.blockDateAdopted = d;
        }
        tx.amount = tx.amountFarm;
        tx.lastPrice = tx.priceFarm;
        tx.coinAddress = tx.tokenAddress;
        tx.type = 'BUY';
        return tx;
    }

    print(): string {
        // (moment(this.blockDateAdopted)).format('HH:mm:ss')
/*        return this.typeToString()
            + ' ' + this.amount?.toFixed(2)
            + ' ' + this.coin
            + ' for ' + this.otherAmount?.toFixed(2)
            + ' ' + this.otherCoin
            + ' price ' + this.lastPrice?.toFixed(2)
            ;*/
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
