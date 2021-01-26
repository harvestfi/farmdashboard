import { Component, AfterViewInit } from '@angular/core';
import { HardWorkDto } from '../../models/hardwork-dto';
import { Utils } from '../../utils';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { StaticValues } from 'src/app/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackService } from '../../services/snack.service';
import {HardWorkHistoryListDialogComponent} from '../../dialogs/hard-work-history-list-dialog/hard-work-history-list-dialog.component';

@Component({
  selector: 'app-hardwork-tx',
  templateUrl: './hardwork-tx.component.html',
  styleUrls: ['./hardwork-tx.component.scss']
})
export class HardworkTxComponent implements AfterViewInit {
  dtos: HardWorkDto[] = [];
  hwIds = new Set<string>();
  pureTitle = 'Harvest Live Dashboard';
  whalesMoreThan = 500;
  private maxMessages = 50;
  

  constructor(
    private hwHistory: HttpService,
    public vt: ViewTypeService,
    private snack: SnackService,
    private log: NGXLogger,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.hwHistory.getHardWorkHistoryData().subscribe(data => {

        this.addInArray(data);
    });
  }

  private addInArray(newValues: HardWorkDto[]): void {
    
    this.log.info('New hard work values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const hardWork = newValues[i];
      HardWorkDto.enrich(hardWork);
      this.dtos.push(hardWork);
      if (this.dtos.length > this.maxMessages) {
        this.dtos.pop();
      }
    }
    
  }

  openHardWorkHistoryListDialog(): void {
    this.dialog.open(HardWorkHistoryListDialogComponent, {
      width: '100%',
      height: 'auto',
    });
  }

}
