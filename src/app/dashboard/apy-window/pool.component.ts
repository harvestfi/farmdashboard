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
    selector: 'app-pool',
    templateUrl: './pool.component.html',
    styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
    @Input() vault: Vault;
    @Input() pool: Pool;

    constructor(private hardworkData: HardworkDataService,
                private harvestData: HarvestDataService,
                private rewardData: RewardDataService,
                private priceData: PriceDataService,
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

    toApy(n: number): number {
        return Utils.aprToApyEveryDayReinvest(n);
    }

    // ---------------- GETTERS --------------------

    get isAutoStakeVault(): boolean {
        const hw = this.hardworkData.getLastHardWork(this.vault.contract.name, this.vault.contract.network);
        if(hw?.autoStake === 1) {
            return true;
        }
        return Utils.isAutoStakeVault(this.vault.contract.name);
    }

    get isFarmVault(): boolean {
        return Utils.isFarmVault(this.vault.contract.name);
    }

    get vaultRewardPeriod(): number {
        return this.rewardData.getRewardPeriod(this.vault.contract.name, this.vault.contract.network);
    }

    get vaultReward(): number {
        return this.rewardData.getReward(this.vault.contract.name, this.vault.contract.network);
    }

    get vaultRewardApr(): number {
        return this.rewardData.vaultRewardApr(this.vault.contract.name, this.vault.contract.network,
            this.harvestData.getVaultLastInfo(this.vault.contract.name, this.vault.contract.network)?.lastUsdTvl,
            this.priceData.getLastFarmPrice());
    }

    get vaultRewardWeeklyApy(): number {
        return this.rewardData.getWeeklyApy(this.vault.contract.name, this.vault.contract.network);
    }

}
