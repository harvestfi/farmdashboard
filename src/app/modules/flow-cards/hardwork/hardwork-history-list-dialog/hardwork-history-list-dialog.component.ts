import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '@data/services/view-type.service';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';
import {HardworksService} from '@data/services/http/hardworks.service';
import {Paginated} from '@data/models/paginated';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {StaticValues} from '@data/static/static-values';
import {Subject} from 'rxjs/internal/Subject';
import {VaultsDataService} from '@data/services/vaults-data.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-hardwork-history-list-dialog',
  templateUrl: './hardwork-history-list-dialog.component.html',
  styleUrls: ['./hardwork-history-list-dialog.component.scss']
})
export class HardworkHistoryListDialogComponent implements AfterViewInit, OnDestroy {
  dtos: Paginated<HardWorkDto>;
  hardWorkIds = new Set<string>();
  vaultFilter;
  minAmount = 0;
  disabled = false;
  ready = false;
  networks: string[] = Array.from(StaticValues.NETWORKS.keys());
  networkIcons: Map<string, string> = StaticValues.NETWORK_ICON;
  network = 'eth';
  vaultsIconsList = [];
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
      public vt: ViewTypeService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private hardworksService: HardworksService,
      private vaultsDataService: VaultsDataService,
  ) {
  }

  ngAfterViewInit(): void {
    this.getDtoDataForPage(0);
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


    getDtoDataForPage(pageNumber: number): void {
    this.hardworksService
    .getPaginatedHardworkHistoryData(10, pageNumber,
        this.vaultFilter?.contract?.address, this.minAmount, 'desc',
        StaticValues.NETWORKS.get(this.network))
    .subscribe(response => {
          this.log.info('Load hw pages', response);
          if ('data' in response) {
            return this.dtos = response;
          }
          this.dtos = {
            currentPage: 0,
            nextPage: -1,
            previousPage: -1,
            totalPages: 0,
            data: []
          };
        }
    )
    .add(() => this.ready = true);
  }

  get vaults(): Vault[] {
    return this.contractsService.getContractsArray(Vault);
  }

  // These methods all seem redundant, but I separated them because we may
  // want to add additional logic to the next/prev/select transitions.
  nextPage($event): void {
    this.getDtoDataForPage($event);
  }

  previousPage($event): void {
    this.getDtoDataForPage($event);
  }

  selectPage($event): void {
    this.getDtoDataForPage($event);
  }

  handleFilterUpdate($event): void {
    this.getDtoDataForPage(0);
  }

  choseNetwork(): void {
    this.getDtoDataForPage(0);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
