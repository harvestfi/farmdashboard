import {Contract} from './contract';
import {IContract} from './icontract';
import {map} from 'rxjs/operators';

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
    isActive(): boolean {
        return !this.contract?.name?.match(/_V0$/) &&
            !new Set([
                'BAC', 'DSD','UNI_WBTC_KLON','SUSHI_WBTC_TBTC','UNI_ETH_DAI','UNI_ETH_USDC','UNI_ETH_USDT','UNI_ETH_WBTC',
                'CRV_AAVE', 'TUSD', 'ESD', 'RENBTC', 'CRV_TBTC', 'ONEINCH_ETH_DAI', 'ONEINCH_ETH_USDC', 'ONEINCH_ETH_WBTC',
                'ONEINCH_ETH_USDT', 'SUSHI_MIC_USDT', 'SUSHI_MIS_USDT'
            ]).has(this.contract.name);
    }
}
