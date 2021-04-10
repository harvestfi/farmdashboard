import {Contract} from './contract';

export class Token {
    id: number;
    contract: Contract;
    updatedBlock: number;
    name: string;
    symbol: string;
    decimals: number;
}
