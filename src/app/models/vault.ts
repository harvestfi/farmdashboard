import {Contract} from './contract';
import {IContract} from "./icontract";

export class Vault implements IContract {
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
    isCRV() {
        return this.underlying?.type === 4 && this.contract?.name?.match(/CRV/);
    }
    isOtherLP() {
        return this.underlying?.type === 2 && !this.underlying?.name?.match(/^UNI_LP/);
    }
    isStableCoin() {
        return this.underlying?.type === 4 && !this.contract?.name?.match(/CRV/);
    }
    isUniLP() {
        return this.underlying?.type === 2 && this.underlying?.name?.match(/^UNI_LP/);
    }
}
