import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {StaticValues} from '../../static-values';
import {RewardDto} from '../../models/reward-dto';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../utils';
import {DialogData} from '../dialog-data';

@Component({
  selector: 'app-rewards-dialog',
  templateUrl: './rewards-dialog.component.html',
  styleUrls: ['./rewards-dialog.component.css']
})
export class RewardsDialogComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  ready = false;

  constructor(private httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.httpService.getHistoryRewards('PS').subscribe(rewards => {
      this.log.debug('History of All PS Rewards loaded ', rewards);

      this.httpService.getHarvestHistoryByVault('PS').subscribe(harvests => {
        this.log.debug('History of All PS Harvests loaded ', harvests);

        const chartBuilder = new ChartBuilder();
        chartBuilder.initVariables(2);

        rewards?.forEach(reward => {
          let harvest: HarvestDto = null;
          for (let i = 1; i < harvests.length; i++) {
            if (harvests[i].blockDate - reward.blockDate >= 0) {
              harvest = harvests[i - 1];
              harvests = harvests.slice(i - 1, harvests.length);
              break;
            }
          }
          if (harvest == null) {
            this.log.info('Not found harvest for reward');
            return;
          }
          const apr = this.vaultRewardApr(reward, harvest);
          if (apr === 0) {
            this.log.info('APR is null for ', reward, harvest);
            return;
          }
          const apy = Utils.aprToApyEveryDayReinvest(apr);
          if (apy > 10000) {
            // skip enormous data
            return;
          }

          chartBuilder.addInData(0, reward.blockDate, apy);
          chartBuilder.addInData(1, reward.blockDate, harvest.lastUsdTvl / 1000000);

        });

        this.handleData(chartBuilder, [
          ['APY %', 'right', '#0085ff'],
          ['TVL M$', '1', '#eeb000']
        ]);
      });

    });
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    const chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(chart, config);
  }

  private vaultRewardApr(reward: RewardDto, harvest: HarvestDto): number {
    if (!harvest || !reward) {
      return 0;
    }
    const period = StaticValues.SECONDS_OF_YEAR / (reward.periodFinish - reward.blockDate);
    return (reward.reward / harvest.lastTvl) * period * 100;
  }
}
