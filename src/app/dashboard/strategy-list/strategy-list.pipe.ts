import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'strategyListFilter',
})
export class StrategyListFilterPipe implements PipeTransform {
    transform(vaults: any[], network: string, platform: string, asset: string): any {

        if (!network && !asset && !platform) {
            return vaults;
        }

        const newVaults = vaults.filter(vault => {
            const networkMatchesFilter = (network ? vault.network === network : true);
            const platformMatchesFilter = (platform ? vault.name.startsWith(platform) : true);
            const assetMatchesFilter = (asset ? vault.name.includes(asset) : true);
            if (networkMatchesFilter && platformMatchesFilter && assetMatchesFilter ) {
                return vault;
            }
        });
        return newVaults;
    }
}
