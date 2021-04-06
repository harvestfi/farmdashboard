import {IContract} from "./icontract";

export interface ContractsResult<T> extends IContract {
    code: number;
    data: T;
    status: string;
}
