import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';
import {Contract} from '../../models/contract';

@Component({
    selector: 'app-strategy',
    templateUrl: './strategy.component.html',
    styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements OnInit {
    @Input() contract: Contract;

    constructor(private hardworkData: HardworkDataService,
                private harvestData: HarvestDataService,
                private log: NGXLogger) {
    }

    ngOnInit(): void {
    }

    hardwork(): HardWorkDto {
        return this.hardworkData.getLastHardWork(this.contract.name, this.contract.network);
    }

    harvest(): HarvestDto {
        return this.harvestData.getVaultLastInfo(this.contract.name, this.contract.network);
    }

    // ---------------- GETTERS --------------------

    get isAutoStakeVault(): boolean {
        const hw = this.hardworkData.getLastHardWork(this.contract.name, this.contract.network);
        if(hw?.autoStake === 1) {
            return true;
        }
        return Utils.isAutoStakeVault(this.contract.name);
    }

    get isFarmVault(): boolean {
        return Utils.isFarmVault(this.contract.name);
    }


    toApy(n: number): number {
        return Utils.aprToApyEveryDayReinvest(n);
    }

    get vaultEarned(): number {
        return this.hardwork()?.fullRewardUsdTotal * (1 - this.hardwork()?.profitSharingRate);
    }

    get vaultEarnedLastWeek(): number {
        return this.hardwork()?.weeklyProfit * (1 - this.hardwork()?.profitSharingRate);
    }

    get vaultPeriodOfWork(): number {
        return this.hardwork()?.periodOfWork
            / (60 * 60 * 24);
    }

    get vaultApr(): number {
        return Math.max(this.hardworkData.getWeeklyApr(this.contract.name, this.contract.network), 0);
    }

    viewNetworkAddress(contractLike: {network: string; address: string}) {
        if (contractLike.network === 'bsc') {
            window.open('https://www.bscscan.com/address/' + contractLike.address, '_blank');
        } else {
            window.open('https://etherscan.io/address/' + contractLike.address, '_blank');
        }
    }

}
