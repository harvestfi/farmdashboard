import {Pipe, PipeTransform} from '@angular/core';
import {ContractsService} from '@data/services/contracts.service';


@Pipe({
    name: 'additionalVaultIcons',
})
export class VaultIconsPipe implements PipeTransform {

    constructor(private contractService: ContractsService) {}
    transform(vault, networkList, error): string {
        let name;
        if (!error) {
            if (vault?.contract && vault?.contract?.name.indexOf('V_') >= 0) {
                name = vault?.contract?.name.replace('V_', '');
            } else if (vault?.contract && vault?.contract?.name.indexOf('P_') >= 0) {
                name = vault?.contract?.name.replace('P_', '');
            } else if (vault?.contract && vault?.contract?.name.startsWith('fUniV3')) {
                name = 'UNISWAP_V3';
            } else if (vault?.contract?.name.startsWith('0x')) {
                name = this.contractService.getContractName(vault);
            }  else {
                name = vault?.contract?.name;
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
