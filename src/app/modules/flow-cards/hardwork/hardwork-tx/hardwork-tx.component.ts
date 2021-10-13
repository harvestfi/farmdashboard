import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '@data/services/view-type.service';
import {SnackBarService} from '@shared/snack-bar/snack-bar.service';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';
import { Utils } from '@data/static/utils';
import {VaultsDataService} from '@data/services/vaults-data.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-hardwork-tx',
  templateUrl: './hardwork-tx.component.html',
  styleUrls: ['./hardwork-tx.component.scss']
})
export class HardworkTxComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hardWorkHistoryListModal') private hardWorkHistoryListModal: CustomModalComponent;
  vaultFilter = 'all';
  minAmout = 0;
  vaultsIconsList = [];
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
      public vt: ViewTypeService,
      private snack: SnackBarService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private hardworksData: HardworkDataService,
      private vaultsDataService: VaultsDataService
  ) {
  }


  get vaultNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
    .map(_ => _.contract?.name);
  }

  ngAfterViewInit(): void {
      this.additionalVaultsList();
  }

  additionalVaultsList(): void {
      this.vaultsDataService.retrieveVaultsList()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data) => {
              this.vaultsIconsList = data;
          }, err => {
              console.log(err);
          });
  }

  get dtos(): HardWorkDto[] {
    return this.hardworksData.getDtos();
  }

  openHardWorkHistoryListDialog(): void {
    this.hardWorkHistoryListModal.open();
  }

  getVaultModel(vaultAddress: string): Vault{
    return this.contractsService.getContracts(Vault).get(vaultAddress);
  }

  getVaultName(vault: string): string {
    return Utils.prettyVaultName(vault);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
