import {Pipe, PipeTransform} from '@angular/core';
import {Pool} from '@data/models/pool';
import {Vault} from '@data/models/vault';
import {ContractsService} from '@data/services/contracts.service';


@Pipe({
    name: 'additionalVaultIcons',
})
export class VaultIconsPipe implements PipeTransform {

    constructor(private contractService: ContractsService) {}
    transform(vault, networkList, error): string {
        let name;
        if (!error) {
            if (vault instanceof Vault) {
                name = vault?.contract?.name.replace('V_', '');
            } else if (vault instanceof Pool) {
                name = vault?.contract?.name.replace('P_', '');
            } else if (vault?.startsWith('0x')) {
                name = this.contractService.getContractName(vault);
            } else {
                name = vault;
            }
        }

        if (!name) {
            if (networkList && networkList.length) {
                return this.fillUnknown(vault, networkList) ? this.fillUnknown(vault, networkList) : `/assets/icons/vaults/UNKNOWN.png`;
            } else {
                return `/assets/icons/vaults/UNKNOWN.png`;
            }
        } else {
            name = name.split('_#').length === 2 ? name.split('_#')[0] : name;
            return `/assets/icons/vaults/${name}.png`;
        }

    }

    fillUnknown(vault, networkList): any {
        let iconUrl = '';
        for (const network of networkList) {
            if (network.network === vault?.contract.network) {
                for (const item of network.vaults) {
                    if (item && vault) {
                        if (item.address && item.address.toLowerCase() === vault.contract.address.toLowerCase()) {
                            iconUrl = item.iconUrl;
                        }
                    }
                }
            }
        }
        return iconUrl;
    }
}
