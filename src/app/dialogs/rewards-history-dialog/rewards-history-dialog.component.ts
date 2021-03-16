import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from "../../models/reward-dto";
import {StaticValues} from '../../static/static-values';
import {Utils} from "../../static/utils";

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
    filters = StaticValues.currentVaults;

    private dayLag = 15;

    constructor(private httpService: HttpService,
                public vt: ViewTypeService,
                private cdRef: ChangeDetectorRef,
                private log: NGXLogger) {
    }

    ngAfterViewInit(): void {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - this.dayLag);
        this.loadRewardsHistory(startDate, new Date());
    }


    private loadRewardsHistory(startDate: Date, endDate: Date): void {
        this.httpService.getAllHistoryRewards(Math.floor(startDate.getTime()/1000), Math.floor(endDate.getTime()/1000)).subscribe((data) => {
            this.rewards.push(...(data.filter(r => !Utils.isAutoStakeVault(r.vault)).map(RewardDto.fillBlockDateAdopted).reverse()));
            this.ready = true;
            this.disabled = false;
            this.cdRef.detectChanges();
        });
    }

    private loadMoreRewardsHistory(): void {
        this.disabled = true;
        const endDate = new Date(this.rewards[this.rewards.length-1]?.blockDate*1000);
        endDate.setTime(endDate.getTime()-1000);
        const startDate = new Date(endDate.getTime());
        startDate.setDate(startDate.getDate() - this.dayLag);
        console.log(`${startDate} , ${endDate}`);
        this.loadRewardsHistory(startDate, endDate);
    }

    getImgUrl(name: string): string {
        return StaticValues.getImgSrcForVault(name);
    }

    openEtherscanTx(hash: string): void {
        return Utils.openEtherscanTx(hash);
    }
}
