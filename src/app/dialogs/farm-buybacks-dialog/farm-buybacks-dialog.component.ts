import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '../../chart/chart-general-methods.component';
import {HardworksService} from '../../services/http/hardworks.service';
import {TvlsService} from '../../services/http/tvls.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {RewardsService} from '../../services/http/rewards.service';
import {StaticValues} from '../../static/static-values';
import {Addresses} from '../../static/addresses';
import {forkJoin} from 'rxjs';
import TreeMap from 'ts-treemap';

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
              private rewardService: RewardsService,
  ) {
    super(cdRef, vt);
  }

  load(): void {

    forkJoin([
      this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network)),
      this.tvlsService.getHistoryTvlByVault(Addresses.ADDRESSES.get('PS')),
      this.rewardService.getAllHistoryRewardsByNetwork(StaticValues.NETWORKS.get(this.network)),
    ]).subscribe(([hardWorks, vaultData, rewards]) => {
      this.log.debug('History of All Farm buybacks loaded ', hardWorks);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(4);

      const cumulativeRewards = new TreeMap<number, number>();
      let rewardsSum = 0;
      rewards?.forEach(dto => {
        if (dto.isWeeklyReward) {
          rewardsSum += dto.reward;
          cumulativeRewards.set(dto.block, rewardsSum);
          chartBuilder.addInData(2, dto.blockDate, rewardsSum / 1000);
        }
      });

      hardWorks?.forEach(dto => {
        let bb = dto.farmBuybackSum;
        if (dto.network === 'bsc') {
          const farmPrice = this.priceData.getLastFarmPrice();
          if (farmPrice && farmPrice !== 0) {
            bb = bb / farmPrice;
          } else {
            bb = 0;
          }
        }

        chartBuilder.addInData(0, dto.blockDate, bb / 1000);

        if (!cumulativeRewards.floorKey(dto.block)) {
          return;
        }
        const rewardsBBRatio = bb / cumulativeRewards.floorEntry(dto.block)[1] * 100;

        chartBuilder.addInData(3, dto.blockDate, rewardsBBRatio);
      });

      this.log.debug('History of PS TVL loaded ', vaultData);
      vaultData?.forEach(dto => chartBuilder.addInData(1, dto.calculateTime, dto.sharePrice / 1000));

      this.handleData(chartBuilder, [
        ['FARM Buyback K', 'right', '#0085ff'],
        ['FARM Total supply K', '1', '#efa4a4'],
        ['FARM Weekly Rewards K', '2', '#28a69a'],
        ['Rewards to BB %', '3', 'red']
      ]);
    });
  }
}
