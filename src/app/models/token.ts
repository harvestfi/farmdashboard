import {Contract} from './contract';
import {IContract} from './icontract';

export class Token implements IContract{
    id: number;
    contract: Contract;
    updatedBlock: number;
    name: string;
    symbol: string;
    decimals: number;
    curveUnderlying: string;
}
