import {Contract} from './contract';

export class Pool {
    id: number;
    contract: Contract;
    updatedBlock: number;
    controller: Contract;
    governance: Contract;
    owner: Contract;
    lpToken: Contract;
    rewardToken: Contract;
}
