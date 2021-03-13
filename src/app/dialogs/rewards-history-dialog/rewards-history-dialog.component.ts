import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from "../../models/reward-dto";

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

    constructor(private httpService: HttpService,
                public vt: ViewTypeService,
                private cdRef: ChangeDetectorRef,
                private log: NGXLogger) {
    }

    ngAfterViewInit(): void {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 5); // start from 5 days ago
        this.loadRewardsHistory(startDate, new Date());
    }

    private loadRewardsHistory(startDate: Date, endDate: Date): void {
        // call service api here for data that is about rewards history?!?!!?
        this.httpService.getAllHistoryRewards(startDate, endDate).subscribe((data) => {
            console.log(data);
            this.rewards.push(...(data.map(RewardDto.fillBlockDateAdopted).reverse()));
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
        startDate.setDate(startDate.getDate() - 5);
        console.log(`${startDate} , ${endDate}`);
        this.loadRewardsHistory(startDate, endDate);
    }
}
