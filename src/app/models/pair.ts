import {Contract} from './contract';
import {Token} from './token';
import {IContract} from "./icontract";

export class Pair implements IContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    keyToken: Token;
    type: number;
    decimals: number;
    token0: Contract;
    token1: Contract;
}
