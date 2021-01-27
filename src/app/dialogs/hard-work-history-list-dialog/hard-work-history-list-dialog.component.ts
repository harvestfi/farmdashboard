import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import { StaticValues } from 'src/app/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { HardWorkDto } from '../../models/hardwork-dto';

@Component({
  selector: 'app-hard-work-history-list-dialog',
  templateUrl: './hard-work-history-list-dialog.component.html',
  styleUrls: ['./hard-work-history-list-dialog.component.scss']
})
export class HardWorkHistoryListDialogComponent implements AfterViewInit {
  dtos: HardWorkDto[] = [];
  hardWorkIds = new Set<string>();
  lowestBlockDate = 999999999999;
  vaultFilter= 'all';
  constructor(
    private hardWorkListHistory: HttpService,
    public vt: ViewTypeService,
    private log: NGXLogger

  ) { }

  ngAfterViewInit(): void {
    this.hardWorkListHistory.getHardWorkHistoryData().subscribe(data => {

        this.addInArray(data);
    });
  }

  get vaultNames(): string[] {
    return StaticValues.currentVaults;
  }

  private addInArray(newValues: HardWorkDto[]): void {
    this.log.info('New hard work values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const hardWork = newValues[i];
      HardWorkDto.enrich(hardWork);
      this.dtos.push(hardWork);
    }
  }

}
