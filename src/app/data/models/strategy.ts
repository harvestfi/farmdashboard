import {Contract} from './contract';
import {IContract} from './icontract';

export class Strategy implements IContract {
  id: number;
  contract: Contract;
  updatedBlock: number;
}
