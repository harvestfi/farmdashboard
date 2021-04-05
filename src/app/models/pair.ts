import {Contract} from './contract';
import {Token} from './token';

export class Pair {
    id: number;
    contract: Contract;
    updatedBlock: number;
    keyToken: Token;
    type: number;
    decimals: number;
    token0: Contract;
    token1: Contract;
}
