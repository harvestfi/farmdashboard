import { Component, AfterViewInit } from '@angular/core';
import { ViewTypeService } from '../../../services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { HarvestDto } from '../../../models/harvest-dto';
import {Vault} from '../../../models/vault';
import {ContractsService} from '../../../services/contracts.service';
import {HarvestsService} from '../../../services/http/harvests.service';
import { Paginated } from 'src/app/models/paginated';


@Component({
  selector: 'app-harvest-history-dialog',
  templateUrl: './harvest-history-dialog.component.html',
  styleUrls: ['./harvest-history-dialog.component.scss']
})
export class HarvestHistoryDialogComponent implements AfterViewInit {
  vaultFilter = 'all';
  dtos: HarvestDto[] = [];
  paginated_dtos: Paginated<HarvestDto> = {
    currentPage: 0,
    nextPage: -1,
    previousPage: -1,
    totalPages: 0,
    data: []
  };
  minAmount = 0;
  filterByVault = '';
  harvestTxIds = new Set<string>();
  lowestBlockDate = 999999999999;
  disabled = false;

  constructor(
    public vt: ViewTypeService,
    private log: NGXLogger,
    private contractsService: ContractsService,
    private harvestsService: HarvestsService
  ) {}

  get tvlNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
        .map(_ => _.contract.name);
  }

  ngAfterViewInit(): void {
    this.getHarvestHistoryForPage(0);
  }

  getHarvestHistoryForPage(page_number){

    this.harvestsService.getHarvestPaginatedTxHistoryData(
      page_number,
      10,
      this.minAmount,
      this.vaultFilter
    ).subscribe(response => {
      this.paginated_dtos = response;
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

  handleFilterUpdate(_$event): void {
    this.getHarvestHistoryForPage(0);
  }
}
