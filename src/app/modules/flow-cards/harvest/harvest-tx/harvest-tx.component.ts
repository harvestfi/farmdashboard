import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {WebsocketService} from '@data/services/websocket.service';
import {HttpService} from '@data/services/http/http.service';
import {NGXLogger} from 'ngx-logger';
import {HarvestDto} from '@data/models/harvest-dto';
import {ViewTypeService} from '@data/services/view-type.service';
import {SnackBarService} from '@shared/snack-bar/snack-bar.service';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';
import {HarvestsService} from '@data/services/http/harvests.service';
import {HarvestDataService} from '@data/services/data/harvest-data.service';
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs/operators";
import {VaultsDataService} from "@data/services/vaults-data.service";

@Component({
  selector: 'app-harvest-tx',
  templateUrl: './harvest-tx.component.html',
  styleUrls: ['./harvest-tx.component.scss']
})
export class HarvestTxComponent implements AfterViewInit, OnDestroy{
  vaultFilter = 'all';
  minAmount = 0;
  openedModal: Record<string, boolean> = {};
  vaultsIconsList = [];
  private ngUnsubscribe = new Subject<boolean>();
  @ViewChild('harvestHistoryModal') private harvestHistoryModal: CustomModalComponent;

  constructor(private ws: WebsocketService,
              private httpService: HttpService,
              private cdRef: ChangeDetectorRef,
              public vt: ViewTypeService,
              private snack: SnackBarService,
              private log: NGXLogger,
              private contractsService: ContractsService,
              private harvestsService: HarvestsService,
              private harvestData: HarvestDataService,
              private contractService: ContractsService,
              private vaultsDataService: VaultsDataService,
  ) {
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

  get vaultNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
    .map(_ => _.contract.name);
  }

  get dtos(): HarvestDto[] {
    return this.harvestData.getDtos();
  }

  /**
   * @TODO: to rename? because it does not provide icon, it provides an entire vault
   */
  getVaultIcon(vaultAddress: string): Vault {
    return this.contractService.getContracts(Vault).get(vaultAddress);
  }

  openHarvestHistory(): void {
    this.harvestHistoryModal.open();
  }

  hideTradeLinks(dtoId: string): void {
    this.openedModal[dtoId] = false;
  }

  showTradeLinks(dtoId: string): void {
    this.openedModal[dtoId] = true;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
