import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HardWorkDto} from '../../../models/hardwork-dto';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '../../../services/view-type.service';
import {SnackService} from '../../../services/snack.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';
import {HardworkDataService} from '../../../services/data/hardwork-data.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-hardwork-tx',
  templateUrl: './hardwork-tx.component.html',
  styleUrls: ['./hardwork-tx.component.scss']
})
export class HardworkTxComponent implements AfterViewInit {
  @ViewChild('hardWorkHistoryListModal') private hardWorkHistoryListModal: CustomModalComponent;
  vaultFilter = 'all';


  constructor(
      public vt: ViewTypeService,
      private snack: SnackService,
      private log: NGXLogger,
      private contractsService: ContractsService,
      private hardworksData: HardworkDataService
  ) {
  }

  get vaultNames(): Observable<string[]> {
    return this.contractsService.getContractsArray(Vault).pipe(
        map(_ => _.map(v => v.contract?.name))
    );
  }

  ngAfterViewInit(): void {
  }

  get dtos(): HardWorkDto[] {
    return this.hardworksData.getDtos();
  }

  openHardWorkHistoryListDialog(): void {
    this.hardWorkHistoryListModal.open();
  }

}
