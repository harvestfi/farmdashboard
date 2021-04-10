import {Contract} from './contract';
import {IContract} from './icontract';

export class Pool implements IContract {
    id: number;
    contract: Contract;
    updatedBlock: number;
    controller: Contract;
    governance: Contract;
    owner: Contract;
    lpToken: Contract;
    rewardToken: Contract;
}
