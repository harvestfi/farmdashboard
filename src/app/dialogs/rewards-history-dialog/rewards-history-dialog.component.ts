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
            this.rewards.unshift(...(data.map(RewardDto.fillBlockDateAdopted)));
            this.ready = true;
            this.disabled = false;
        });
    }

    private loadMoreRewardsHistory(): void {
      this.disabled = true;
      const endDate = new Date(this.rewards[0]?.blockDate);
      const startDate = new Date(endDate.getTime());
      startDate.setDate(startDate.getDate()-5);
      this.loadRewardsHistory(endDate, endDate);
    }
}
