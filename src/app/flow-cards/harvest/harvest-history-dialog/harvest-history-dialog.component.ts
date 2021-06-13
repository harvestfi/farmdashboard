import {AfterContentInit, Component} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {HarvestDto} from '../../../models/harvest-dto';
import {Vault} from '../../../models/vault';
import {ContractsService} from '../../../services/contracts.service';
import {HarvestsService} from '../../../services/http/harvests.service';
import {Paginated} from 'src/app/models/paginated';


@Component({
  selector: 'app-harvest-history-dialog',
  templateUrl: './harvest-history-dialog.component.html',
  styleUrls: ['./harvest-history-dialog.component.scss']
})
export class HarvestHistoryDialogComponent implements AfterContentInit {
  vaultFilter: Vault;
  paginatedDtos: Paginated<HarvestDto> = Paginated.empty();
  minAmount = 0;

  constructor(
      public vt: ViewTypeService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private harvestsService: HarvestsService
  ) {
  }

  ngAfterContentInit(): void {
    this.getHarvestHistoryForPage(0);
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
}
