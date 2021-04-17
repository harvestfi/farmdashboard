import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HardWorkDto} from '../../../models/hardwork-dto';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '../../../services/view-type.service';
import {SnackService} from '../../../services/snack.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {Observable} from 'rxjs';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';
import {map} from 'rxjs/operators';
import {HardworksService} from '../../../services/http/hardworks.service';

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
    this.hardworksService.getPaginatedHardworkHistoryData(50).subscribe(data => {
      this.log.info('hard work history values', data);
      this.addInArray(data.data.data);
    });
    this.hardworksService.subscribeToHardworks().subscribe(hardwork => this.addInArray([hardwork]));
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
      this.dtos.push(hardWork);
      if (this.dtos.length > this.maxMessages) {
        this.dtos.shift();
      }
    }

  }

  openHardWorkHistoryListDialog(): void {
    this.hardWorkHistoryListModal.open();
  }

}
