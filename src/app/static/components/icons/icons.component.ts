import {Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {Pool} from '../../../models/pool';
import {Vault} from '../../../models/vault';
import {ContractsService} from '../../../services/contracts.service';

@Component({
    selector: 'app-vault-icon',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.css']
})

export class IconsComponent {
    @Input() vault: string | Vault | Pool;

    constructor(
        public vt: ViewTypeService,
        private contractService: ContractsService
    ) {
    }

    iconImageSrc(): string {
        let name;
        if (this.vault instanceof Vault) {
            name = this.vault?.contract?.name;
        } else if (this.vault instanceof Pool) {
            name = this.vault?.contract?.name.replace('ST_', '');
        } else if (this.vault.startsWith('0x')) {
            name = this.contractService.getContractName(this.vault);
        } else {
            name = this.vault;
        }
        if (!name) {
            name = 'UNKNOWN';
        }
        name = name.split('_#').length === 2 ? name.split('_#')[0] : name;
        return `/assets/icons/vaults/${name}.png`;
    }
}
