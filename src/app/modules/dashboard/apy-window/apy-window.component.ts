<<<<<<< HEAD:src/app/dashboard/apy-window/apy-window.component.ts
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {Vault} from '../../models/vault';
import {Pool} from '../../models/pool';
import {CustomModalComponent} from '../../dialogs/custom-modal/custom-modal.component';
import {StaticValues} from '../../static/static-values';
=======
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Vault} from '@data/models/vault';
import {Pool} from '@data/models/pool';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {StaticValues} from '@data/static/static-values';
>>>>>>> origin/dev:src/app/modules/dashboard/apy-window/apy-window.component.ts

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.scss']
})
export class ApyWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() vault: Vault;
  @Input() pool: Pool;
  @ViewChild('incomeModal') private incomeModal: CustomModalComponent;
  @ViewChild('psApyModal') private psApyModal: CustomModalComponent;
  @ViewChildren(CustomModalComponent) private tvlModals: QueryList<CustomModalComponent>;

  constructor() {
  }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.showModal.emit(false);
  }


  // ------------------- DIALOGS --------------------

  openIncomeDialog(): void {
    if (StaticValues.PS_VAULTS.has(this.vault.contract.address)) {
      this.openPsApyDialog();
      return;
    }
    this.incomeModal.open();
  }

  openTvlDialog(address: string): void {
    this.tvlModals
    .find(e => e.name === 'tvlModal_' + address)
    ?.open();
  }

  private openPsApyDialog(): void {
    this.psApyModal.open();
  }
}
