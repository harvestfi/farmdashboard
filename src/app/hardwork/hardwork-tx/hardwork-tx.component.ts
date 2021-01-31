import { Component, AfterViewInit } from '@angular/core';
import { HardWorkDto } from '../../models/hardwork-dto';
import { Utils } from '../../utils';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import {WebsocketService} from '../../services/websocket.service';
import { StaticValues } from 'src/app/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackService } from '../../services/snack.service';
import {HardworkSubscriberService} from '../../services/hardwork-subscriber.service';
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
  vaultFilter = 'all';
  subscribed = false;
  private maxMessages = 50;


  constructor(
    private hwHistory: HttpService,
    private hwSubscriber: HardworkSubscriberService,
    public vt: ViewTypeService,
    private snack: SnackService,
    private log: NGXLogger,
    private dialog: MatDialog
  ) { }

  get vaultNames(): string[] {
    return StaticValues.currentVaults;
  }

  setSubscribed(s: boolean): void {
    this.subscribed = s;
  }

  isSubscribed(): boolean {
    return this.subscribed;
  }

  ngAfterViewInit(): void {
    this.hwHistory.getHardWorkHistoryData().subscribe(data => {

        this.addInArray(data);
    });
    this.hwSubscriber.initWs();
    this.hwSubscriber.handlers.set(this, (tx) => {

      if (!this.isUniqHardwork(tx)) {
        this.log.error('Not unique', tx);
        return;
      }

    });

    
  }





  private isUniqHardwork(hw: HardWorkDto): boolean {
    if (this.hwIds.has(hw.id)) {
      return false;
    }
    this.hwIds.add(hw.id);
    if (this.hwIds.size > 100_000) {
      this.hwIds = new Set<string>();
    }
    return true;
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
