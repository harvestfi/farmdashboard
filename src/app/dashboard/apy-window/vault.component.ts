import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {Vault} from '../../models/vault';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';

@Component({
    selector: 'app-vault',
    templateUrl: './vault.component.html',
    styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
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

    // ********* VAULT *************
    get sharePrice(): number {
        return this.harvest().sharePrice;
    };

    get currentTvl(): number {
        return this.hardwork()?.tvl;
    };

    get vaultAvgTvl(): number {
        let avgTvl = this.hardwork()?.weeklyAverageTvl;
        if (!avgTvl || avgTvl === 0) {
            avgTvl = this.hardwork()?.tvl;
        }
        return avgTvl;
    }

    viewNetworkAddress(contractLike: {network: string; address: string}) {
        if (contractLike.network === 'bsc') {
            window.open('https://www.bscscan.com/address/' + contractLike.address, '_blank');
        } else {
            window.open('https://etherscan.io/address/' + contractLike.address, '_blank');
        }
    }
}
