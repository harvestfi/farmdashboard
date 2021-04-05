import {Contract} from './contract';

export class Vault {
    id: number;
    name: string;
    underlyingUnit: number;
    updatedBlock: number;
    contract: Contract;
    controller: Contract;
    decimals: number;
    governance: Contract;
    strategy: Contract;
    underlying: Contract;
    symbol: string;
    isStableCoin() {
        return this.underlying?.type === 4 && !this.contract?.name?.match(/CRV/);
    }
    isCRV() {
        return this.underlying?.type === 4 && this.contract?.name?.match(/CRV/);
    }
    isUniLP() {
        return this.underlying?.type === 2 && this.underlying?.name?.match(/^UNI_LP/);
    }
    isOtherLP() {
        return this.underlying?.type === 2 && !this.underlying?.name?.match(/^UNI_LP/);
    }
}
