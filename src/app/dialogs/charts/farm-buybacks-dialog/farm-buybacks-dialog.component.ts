import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '../../../chart/chart-general-methods.component';
import {HardworksService} from '../../../services/http/hardworks.service';
import {TvlsService} from '../../../services/http/tvls.service';
import {PriceDataService} from '../../../services/data/price-data.service';
import {StaticValues} from '../../../static/static-values';
import {RewardsService} from '../../../services/http/rewards.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-farm-buybacks-dialog',
  templateUrl: './farm-buybacks-dialog.component.html',
  styleUrls: ['./farm-buybacks-dialog.component.css']
})
export class FarmBuybacksDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
              private priceData: PriceDataService,
              private tvlsService: TvlsService,
              private rewardsService: RewardsService,
  ) {
    super(cdRef, vt);
  }

  load(): void {
    const rewardsRequest = this.rewardsService.getHistoryRewards('PS', StaticValues.NETWORKS.get(this.network));
    const hardworkRequest = this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network));
    const historyTvlRequest = this.tvlsService.getHistoryTvlByVault('PS');

    forkJoin([rewardsRequest, hardworkRequest, historyTvlRequest])
      .subscribe(([rewards, data, vaultData]) => {
        this.log.debug('History of All rewards ', rewards);
        this.log.debug('History of All Farm buybacks loaded ', data);
        this.log.debug('History of PS TVL loaded ', vaultData);

        const totalReward = rewards
          .filter((reward) => reward.isWeeklyReward)
          .reduce((acc, obj) => acc + obj.reward, 0);

        const chartBuilder = new ChartBuilder();
        chartBuilder.initVariables(3);

        data?.forEach(dto => {
          let bb = dto.farmBuybackSum / 1000;
          if (dto.network === 'bsc') {
            const farmPrice = this.priceData.getLastFarmPrice();
            if (farmPrice && farmPrice !== 0) {
              bb = bb / farmPrice;
            } else {
              bb = 0;
            }
          }
          chartBuilder.addInData(0, dto.blockDate, bb);
          chartBuilder.addInData(1, dto.blockDate, totalReward / dto.farmBuybackSum);
        });

        vaultData?.forEach(dto => chartBuilder.addInData(2, dto.calculateTime, dto.sharePrice / 1000));

        this.handleData(chartBuilder, [
          ['FARM Buyback K', 'right', '#0085ff'],
          ['Comparison K', '1', '#28a69a'],
          ['All supply K', '2', '#efa4a4'],
        ]);
      });
  }
}
