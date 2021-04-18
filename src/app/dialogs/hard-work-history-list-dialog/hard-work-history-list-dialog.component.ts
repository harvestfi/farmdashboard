import {AfterViewInit, Component} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '../../services/view-type.service';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HardworksService} from '../../services/http/hardworks.service';
import {Paginated} from '../../models/paginated';
import {HardWorkDto} from '../../models/hardwork-dto';

@Component({
  selector: 'app-hard-work-history-list-dialog',
  templateUrl: './hard-work-history-list-dialog.component.html',
  styleUrls: ['./hard-work-history-list-dialog.component.scss']
})
export class HardWorkHistoryListDialogComponent implements AfterViewInit {
  dtos: Paginated<HardWorkDto>;
  hardWorkIds = new Set<string>();
  lowestBlockDate = 999999999999;
  vaultFilter = '';
  minAmount = 0;
  disabled  = false;
  ready = false;
  constructor(
    public vt: ViewTypeService,
    private log: NGXLogger,
    private contractsService: ContractsService,
    private hardworksService: HardworksService,
  ) {}

  ngAfterViewInit(): void {
    this.getDtoDataForPage(0);
  }

  getDtoDataForPage(page_number: number): void {
    this.hardworksService
    .getPaginatedHardworkHistoryData(10, page_number, this.vaultFilter, this.minAmount)
    .subscribe(response => {
          if ('data' in response.data) {
            return this.dtos = response.data;
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

  get vaultNames(): Observable<string[]> {
    return this.contractsService.getContracts(Vault).pipe(
        map(vaults => vaults.map(_ => _.contract.name))
    );
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

  handleFilterUpdate(_$event): void {
    this.getDtoDataForPage(0);
  }
}
