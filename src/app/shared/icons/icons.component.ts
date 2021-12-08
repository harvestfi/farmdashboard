import {Component, Input} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {Pool} from '@data/models/pool';
import {Vault} from '@data/models/vault';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-vault-icon',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})

export class IconsComponent {
  @Input() vault: string | Vault | Pool;
  @Input() networks: [];
  error = false;

  constructor(
      public vt: ViewTypeService,
      private log: NGXLogger) {}

    errorIcon(): void {
        this.error = true;
    }
}
