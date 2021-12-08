import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Vault } from '@data/models/vault';
import { Pool } from '@data/models/pool';
import { CustomModalComponent } from '@shared/custom-modal/custom-modal.component';
import { StaticValues } from '@data/static/static-values';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.scss'],
})
export class ApyWindowComponent implements OnInit {
  @Input() vault: Vault;
  @Input() pool: Pool;

  @Output() showModal = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('incomeModal') private incomeModal: CustomModalComponent;
  @ViewChild('psApyModal') private psApyModal: CustomModalComponent;
  @ViewChild('tvlApyModal') private tvlModal: CustomModalComponent;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onCloseModal(event: MouseEvent): void {
    event.stopPropagation();

    this.closeModal.emit();
  }

  openChartPage(): void {
    this.router.navigateByUrl(`/info/${ this.vault.contract.network }/${ this.vault.contract.address }`);
  }


  // ------------------- DIALOGS --------------------

  openIncomeDialog(): void {
    if (StaticValues.PS_VAULTS.has(this.vault.contract.address)) {
      this.openPsApyDialog();
      return;
    }
    this.incomeModal.open();
  }

  openTvlDialog(): void {
    this.tvlModal.open();
  }

  private openPsApyDialog(): void {
    this.psApyModal.open();
  }
}
