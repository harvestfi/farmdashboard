import {AfterViewInit, Component} from '@angular/core';
import {HardWorkDto} from '../../../models/hardwork-dto';
import {HttpService} from '../../../services/http.service';
import {NGXLogger} from 'ngx-logger';
import {StaticValues} from 'src/app/static-values';
import {ViewTypeService} from '../../../services/view-type.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackService} from '../../../services/snack.service';
import {HardworkSubscriberService} from '../../../services/hardwork-subscriber.service';
import {HardWorkHistoryListDialogComponent} from '../../../dialogs/hard-work-history-list-dialog/hard-work-history-list-dialog.component';

@Component({
  selector: 'app-hardwork-tx',
  templateUrl: './hardwork-tx.component.html',
  styleUrls: ['./hardwork-tx.component.scss']
})
export class HardworkTxComponent implements AfterViewInit {
  dtos: HardWorkDto[] = [];
  hwIds = new Set<string>();
  vaultFilter = 'all';
  private maxMessages = 50;


  constructor(
      private httpService: HttpService,
      private hwSubscriber: HardworkSubscriberService,
      public vt: ViewTypeService,
      private snack: SnackService,
      private log: NGXLogger,
      private dialog: MatDialog
  ) {
  }

  get vaultNames(): string[] {
    return StaticValues.currentVaults;
  }

  ngAfterViewInit(): void {
    // todo optimize request
    this.httpService.getHardWorkHistoryData().subscribe(data => {
      this.log.info('hard work values', data);
      this.addInArray(data);
    });

    this.hwSubscriber.initWs();
    this.hwSubscriber.handlers.set(this, (tx) => {
      try {
        this.addInArray([tx]);
      } catch (e) {
        this.log.error('Error handle hardwork from ws', tx, e);
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
    for (const hardWork of newValues) {
      HardWorkDto.enrich(hardWork);
      if (!this.isUniqHardwork(hardWork)) {
        this.log.error('Not unique', hardWork);
        return;
      }
      this.dtos.unshift(hardWork);
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
