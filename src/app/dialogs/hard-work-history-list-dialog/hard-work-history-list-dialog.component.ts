import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import { StaticValues } from 'src/app/static/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { HardWorkDto } from '../../models/hardwork-dto';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HardworksService} from '../../services/hardworks.service';

@Component({
  selector: 'app-hard-work-history-list-dialog',
  templateUrl: './hard-work-history-list-dialog.component.html',
  styleUrls: ['./hard-work-history-list-dialog.component.scss']
})
export class HardWorkHistoryListDialogComponent implements AfterViewInit {
  dtos: HardWorkDto[] = [];
  hardWorkIds = new Set<string>();
  lowestBlockDate = 999999999999;
  vaultFilter = 'all';
  disabled  = false;
  ready = false;
  constructor(
    public vt: ViewTypeService,
    private log: NGXLogger,
    private contractsService: ContractsService,
    private hardworksService: HardworksService,
  ) { }

  ngAfterViewInit(): void {
    this.hardworksService.getHardWorkHistoryData(null).subscribe(data => this.addInArray(data)).add(() => this.ready = true);

  }

  get vaultNames(): Observable<string[]> {
    return this.contractsService.getContracts(Vault).pipe(
        map(vaults => vaults.map(_ => _.contract.name))
    );
  }

  private isUniqHardwork(hw: HardWorkDto): boolean {
    if (this.hardWorkIds.has(hw.id)) {
      return false;
    }
    this.hardWorkIds.add(hw.id);
    if (this.hardWorkIds.size > 100_000) {
      this.hardWorkIds = new Set<string>();
    }
    return true;
  }

  private addInArray(newValues: HardWorkDto[]): void {
    // this.log.info('New hard work values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const hardWork = newValues[i];
      if (!this.isUniqHardwork(hardWork)) {
        this.log.warn('Not unique transaction', hardWork);
        continue;
      }
      if (hardWork.blockDate < this.lowestBlockDate) {
        this.lowestBlockDate = hardWork.blockDate;
      }
      HardWorkDto.enrich(hardWork);
      this.dtos.push(hardWork);
    }
  }

}
