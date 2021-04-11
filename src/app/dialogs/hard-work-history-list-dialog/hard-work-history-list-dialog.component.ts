import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import { ViewTypeService } from '../../services/view-type.service';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PaginatedObject} from '../../common/paginator/paginator.component';

@Component({
  selector: 'app-hard-work-history-list-dialog',
  templateUrl: './hard-work-history-list-dialog.component.html',
  styleUrls: ['./hard-work-history-list-dialog.component.scss']
})
export class HardWorkHistoryListDialogComponent implements AfterViewInit {
  dtos: PaginatedObject;
  hardWorkIds = new Set<string>();
  lowestBlockDate = 999999999999;
  vaultFilter = '';
  disabled  = false;
  ready = false;
  constructor(
    private hwListHistory: HttpService,
    public vt: ViewTypeService,
    private log: NGXLogger,
    private contractsService: ContractsService
  ) {}

  ngAfterViewInit(): void {
    this.getDtoDataForPage(0);
  }

  getDtoDataForPage(page_number: number): void {
    this.hwListHistory
    .getPaginatedHardworkHistoryData(10, page_number, this.vaultFilter)
    .subscribe((response: any) => {
      if ('data' in response.data){
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

  handleVaultFilter(_$event): void {
    this.getDtoDataForPage(0);
  }
}
