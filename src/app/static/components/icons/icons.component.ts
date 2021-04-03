import {Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {Vault} from "../../../services/contracts.service";

@Component({
    selector: 'vault-icon',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.css']
})

export class IconsComponent {
    @Input() vault: string | Vault;

    constructor(public vt: ViewTypeService) {}

    iconImageSrc(): string {
        console.log(this.vault);
        const name = (this.vault instanceof Vault ? (this.vault?.contract?.name) : this.vault)?.toLowerCase().replace(/_/g, "-");
        const s = `/assets/icons/${name}.png`;
        console.log(s);
        return s;
    }
}
