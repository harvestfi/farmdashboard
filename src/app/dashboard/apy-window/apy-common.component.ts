import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';
import {Vault} from '../../models/vault';
import {CustomModalComponent} from '../../dialogs/custom-modal/custom-modal.component';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Pool} from '../../models/pool';
import {ContractsService} from '../../services/contracts.service';

@Component({
    selector: 'app-apy-common',
    templateUrl: './apy-common.component.html',
    styleUrls: ['./apy-common.component.scss']
})
export class ApyCommonComponent implements OnInit {
    @Input() vault: Vault;

    constructor(private hardworkData: HardworkDataService,
                private harvestData: HarvestDataService,
                private log: NGXLogger) {
    }

    ngOnInit(): void {
    }

    hardwork(): HardWorkDto {
        return this.hardworkData.getLastHardWork(this.vault.contract.name, this.vault.contract.network);
    }

    harvest(): HarvestDto {
        return this.harvestData.getVaultLastInfo(this.vault.contract.name, this.vault.contract.network);
    }

}
