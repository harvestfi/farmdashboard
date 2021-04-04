import {Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {Pool, Vault} from '../../../services/contracts.service';

@Component({
    selector: 'app-vault-icon',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.css']
})

export class IconsComponent {
    @Input() vault: string | Vault | Pool;

    constructor(public vt: ViewTypeService) {}

    iconImageSrc(): string {
        const name = (this.vault instanceof Vault || this.vault instanceof Pool ? (this.vault?.contract?.name) : this.vault)
            ?.toLowerCase().replace(/_/g, '-');
        return `/assets/icons/${name}.png`;
    }
}
