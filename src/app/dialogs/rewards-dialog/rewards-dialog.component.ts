import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {StaticValues} from '../../static/static-values';
import {RewardDto} from '../../models/reward-dto';
import {HarvestDto} from '../../models/harvest-dto';

@Component({
  selector: 'app-rewards-dialog',
  templateUrl: './rewards-dialog.component.html',
  styleUrls: ['./rewards-dialog.component.css']
})
export class RewardsDialogComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input() public data: Record<any, any>;
  ready = false;

  constructor(private httpService: HttpService,
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

          chartBuilder.addInData(0, reward.blockDate, reward.weeklyApy);
          chartBuilder.addInData(1, reward.blockDate, harvest.lastUsdTvl / 1000000);

        });

        this.handleData(chartBuilder, [
          ['Weekly APY %', 'right', '#0085ff'],
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
