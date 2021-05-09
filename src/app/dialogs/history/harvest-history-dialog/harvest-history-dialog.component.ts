import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { StaticValues } from 'src/app/static/static-values';
import { ViewTypeService } from '../../../services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { HarvestDto } from '../../../models/harvest-dto';
import {Observable} from 'rxjs';
import {Vault} from '../../../models/vault';
import {map} from 'rxjs/operators';
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

  getOlderTransactions(): void {
    this.disabled = true;
    if (this.lowestBlockDate === 0) {
      return;
    }
    this.harvestsService
      .getHarvestTxHistoryByRangeAllNetworks(
          this.lowestBlockDate - (StaticValues.SECONDS_OF_DAY * 2),
          this.lowestBlockDate)
      .subscribe(data => {
        this.addInArray(data);
      }).add(() => this.disabled = false);
  }

  private isUniqTx(tx: HarvestDto): boolean {
    if (this.harvestTxIds.has(tx.id)) {
      return false;
    }
    this.harvestTxIds.add(tx.id);
    if (this.harvestTxIds.size > 100_000) {
      this.harvestTxIds = new Set<string>();
    }
    return true;
  }

  private addInArray(newValues: HarvestDto[]): void {

    this.log.info('New values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const tx = newValues[i];
      if (!this.isUniqTx(tx)) {
        this.log.warn('Not unique transaction', tx);
        continue;
      }
      if (tx.blockDate < this.lowestBlockDate) {
        this.lowestBlockDate = tx.blockDate;
      }
      HarvestDto.enrich(tx);
      this.paginated_dtos.data.push(tx);

    }
  }

  getHarvestHistoryForPage(page_number){
    this.harvestTxIds = new Set();
    this.harvestsService.getHarvestPaginatedTxHistoryData(
      page_number,
      10,
      this.minAmount,
      this.vaultFilter
    )
    .then(data => {
      const d = data.data;
      this.paginated_dtos = data;
      this.paginated_dtos.data = [];
      this.addInArray(d);
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
