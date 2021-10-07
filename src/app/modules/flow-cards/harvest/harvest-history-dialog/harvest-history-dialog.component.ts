import {AfterContentInit, Component, OnDestroy} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {HarvestDto} from '@data/models/harvest-dto';
import {Vault} from '@data/models/vault';
import {ContractsService} from '@data/services/contracts.service';
import {HarvestsService} from '@data/services/http/harvests.service';
import {Paginated} from '@data/models/paginated';
import {Subject} from 'rxjs/internal/Subject';
import {VaultsDataService} from '@data/services/vaults-data.service';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-harvest-history-dialog',
  templateUrl: './harvest-history-dialog.component.html',
  styleUrls: ['./harvest-history-dialog.component.scss']
})
export class HarvestHistoryDialogComponent implements AfterContentInit, OnDestroy {
  vaultFilter: Vault;
  paginatedDtos: Paginated<HarvestDto> = Paginated.empty();
  minAmount = 0;
  vaultsIconsList = [];
  private ngUnsubscribe = new Subject<boolean>();


    constructor(
      public vt: ViewTypeService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private harvestsService: HarvestsService,
      private vaultsDataService: VaultsDataService,
  ) {
  }

  ngAfterContentInit(): void {
    this.additionalVaultsList();
    this.getHarvestHistoryForPage(0);
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

  get vaults(): Vault[] {
    return this.contractsService.getContractsArray(Vault);
  }

  getHarvestHistoryForPage(pageNumber): void {
    this.harvestsService.getHarvestPaginatedTxHistoryData(
        pageNumber,
        10,
        this.minAmount,
        this.vaultFilter?.contract?.address
    ).subscribe(response => {
      this.log.info('Harvest page response', response);
      response?.data?.forEach(dto => HarvestDto.enrich(dto));
      this.paginatedDtos = response;
    });
  }

  nextPage($event): void {
    this.getHarvestHistoryForPage($event);
  }

  previousPage($event): void {
    this.getHarvestHistoryForPage($event);
  }

  selectPage($event): void {
    this.getHarvestHistoryForPage($event);
  }

  handleFilterUpdate($event): void {
    this.getHarvestHistoryForPage(0);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
