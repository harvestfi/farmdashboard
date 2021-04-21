import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from '../../models/reward-dto';
import {Utils} from '../../static/utils';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {RewardsService} from '../../services/http/rewards.service';

@Component({
    selector: 'app-rewards-history-dialog',
    templateUrl: './rewards-history-dialog.component.html',
    styleUrls: ['./rewards-history-dialog.component.css']
})

export class RewardsHistoryDialogComponent implements AfterViewInit {
    @Input() data;
    rewards: Array<RewardDto> = [];
    ready = false;
    disabled = false;
    vaultFilter = '';
    filters: string[];

    private dayLag = 15;

    constructor(public vt: ViewTypeService,
                private cdRef: ChangeDetectorRef,
                private log: NGXLogger,
                private contractsService: ContractsService,
                private rewardsService: RewardsService,
                ) {
    }

    ngAfterViewInit(): void {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - this.dayLag);
        this.contractsService.getContracts(Vault).subscribe(vaults => {
            this.filters = vaults.filter(_ => _.isActive()).map(_ => _.contract?.name);
        });
        this.loadRewardsHistory(startDate, new Date());
    }


    private loadRewardsHistory(startDate: Date, endDate: Date): void {
        this.rewardsService.getAllHistoryRewards(
            Math.floor(startDate.getTime() / 1000),
            Math.floor(endDate.getTime() / 1000))
        .subscribe((data) => {
            this.rewards.push(...(data.filter(r => !Utils.isAutoStakeVault(r.vault)).map(RewardDto.fillBlockDateAdopted).reverse()));
            this.ready = true;
            this.disabled = false;
            this.cdRef.detectChanges();
        });
    }

    private loadMoreRewardsHistory(): void {
        this.disabled = true;
        const endDate = new Date(this.rewards[this.rewards.length - 1]?.blockDate * 1000);
        endDate.setTime(endDate.getTime() - 1000);
        const startDate = new Date(endDate.getTime());
        startDate.setDate(startDate.getDate() - this.dayLag);
        this.loadRewardsHistory(startDate, endDate);
    }

    openEtherscanTx(hash: string): void {
        return Utils.openEtherscanTx(hash);
    }
}
