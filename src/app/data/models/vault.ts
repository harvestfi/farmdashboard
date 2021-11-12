import {Contract} from './contract';
import {IContract} from './icontract';

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
  totalTVL?: number;
  totalTVLPrettify?: string;
  totalEarning?: number;
}
