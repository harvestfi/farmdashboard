import {Contract} from './contract';

export class ContractVault {
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
}
