import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '../../../chart/chart-general-methods.component';
import {HardworksService} from '../../../services/http/hardworks.service';
import {TvlsService} from '../../../services/http/tvls.service';
import {PriceDataService} from '../../../services/data/price-data.service';
import {StaticValues} from '../../../static/static-values';
import {Addresses} from '../../../static/addresses';
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
  ) {
    super(cdRef, vt);
  }

  private calcRewardComparison(buyBack: number, rewards: number): number {
    return 100 * Math.abs((buyBack - rewards ) / ((buyBack + rewards)/2))
  }

  load(): void {

    forkJoin([
      this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network)),
      this.tvlsService.getHistoryTvlByVault(Addresses.ADDRESSES.get('PS')),
    ]).subscribe(([hardWorks, vaultData]) => {
      this.log.debug('History of All Farm buybacks loaded ', hardWorks);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(4);

      hardWorks?.forEach(dto => {
        const rewardEmissionRatio = this.calcRewardComparison(dto.farmBuyback, dto.fullRewardUsd);
        let bb = dto.farmBuybackSum / 1000;
        let rewards = dto.fullRewardUsd;
        if (dto.network === 'bsc') {
          const farmPrice = this.priceData.getLastFarmPrice();
          if (farmPrice && farmPrice !== 0) {
            bb = bb / farmPrice;
          } else {
            bb = 0;
          }
        }
        chartBuilder.addInData(3, dto.blockDate, rewards)
        chartBuilder.addInData(0, dto.blockDate, bb);
        chartBuilder.addInData(2, dto.blockDate, rewardEmissionRatio);
      });

      this.log.debug('History of PS TVL loaded ', vaultData);
      vaultData?.forEach(dto => chartBuilder.addInData(1, dto.calculateTime, dto.sharePrice / 1000));

      this.handleData(chartBuilder, [
        ['FARM Buyback K', 'right', '#0085ff'],
        ['All supply K', '1', '#efa4a4'],
        ['Buyback Vs. Rewards K', '2', '#28a69a'],
        ['Rewards', '3', '#7e7e7e']
      ]);
    });
  }
}
