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

        if (name) {
            name = name.split('_#').length === 2 ? name.split('_#')[0] : name;
            return `/assets/icons/vaults/${name}.png`;
        }

        if (!networkList?.length) {
            return '/assets/icons/vaults/UNKNOWN.png';
        }

        if (!name && networkList?.length && vault) {
            const unknownIcon = this.fillUnknown(vault, networkList);
            return unknownIcon || `/assets/icons/vaults/UNKNOWN.png`;
        }

        return '/assets/icons/vaults/UNKNOWN.png';
    }

    fillUnknown({ contract: {network, address} }, networkList): string {
        let iconUrl = '';
        networkList
            .filter(it => it.network === network)
            .forEach(it => {
                iconUrl = (it.vaults.find(vault => address && vault.address?.toLowerCase() === address.toLowerCase()))?.iconUrl || '';
            });
        return iconUrl;
    }
}
