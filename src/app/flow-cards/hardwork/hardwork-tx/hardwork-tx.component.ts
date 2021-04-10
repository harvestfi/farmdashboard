import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HardWorkDto} from '../../../models/hardwork-dto';
import {HttpService} from '../../../services/http.service';
import {NGXLogger} from 'ngx-logger';
import {StaticValues} from 'src/app/static/static-values';
import {ViewTypeService} from '../../../services/view-type.service';
import {SnackService} from '../../../services/snack.service';
import {HardworkSubscriberService} from '../../../services/hardwork-subscriber.service';
import {HardWorkHistoryListDialogComponent} from '../../../dialogs/hard-work-history-list-dialog/hard-work-history-list-dialog.component';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';
import {Observable} from 'rxjs';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';
import {map} from 'rxjs/operators';
import {HardworksService} from '../../../services/hardworks.service';

@Component({
  selector: 'app-hardwork-tx',
  templateUrl: './hardwork-tx.component.html',
  styleUrls: ['./hardwork-tx.component.scss']
})
export class HardworkTxComponent implements AfterViewInit {
  private maxMessages = 50;
  @ViewChild('hardWorkHistoryListModal') private hardWorkHistoryListModal: CustomModalComponent;
  dtos: HardWorkDto[] = [];
  hwIds = new Set<string>();
  vaultFilter = 'all';


  constructor(
      private hwSubscriber: HardworkSubscriberService,
      public vt: ViewTypeService,
      private snack: SnackService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private hardworksService: HardworksService,
  ) {
  }

  get vaultNames(): Observable<string[]> {
    return this.contractsService.getContracts(Vault).pipe(
        map(vaults => vaults.map(_ => _.contract?.name))
    );
  }

  ngAfterViewInit(): void {
    // todo optimize request
    this.hardworksService.getHardWorkHistoryData(null).subscribe(data => {
      this.log.info('hard work history values', data);
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
    this.hardWorkHistoryListModal.open();
  }

}
