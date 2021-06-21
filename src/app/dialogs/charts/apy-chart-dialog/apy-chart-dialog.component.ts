import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {HttpService} from '../../../services/http/http.service';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';
import {HardworksService} from '../../../services/http/hardworks.service';
import {StaticValues} from '../../../static/static-values';

@Component({
  selector: 'app-apy-chart-dialog',
  templateUrl: './apy-chart-dialog.component.html',
  styleUrls: ['./apy-chart-dialog.component.css']
})
export class ApyChartDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @Input('data') public data: Record<any, any>;

  constructor(private httpService: HttpService,
              public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
  ) {
    super(cdRef, vt);
  }

  load(): void {
    this.log.info('APY window data', this.data);
    this.hardworksService.getHardWorkHistoryDataByAddress(this.data.address,
      StaticValues.NETWORKS.get(this.data.network)).subscribe(data => {
      this.log.debug('History of All Incomes loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(3);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.blockDate, (dto.fullRewardUsdTotal * (1 - dto.profitSharingRate)) / 1000);
        chartBuilder.addInData(1, dto.blockDate, dto.fullRewardUsd);
        chartBuilder.addInData(2, dto.blockDate, dto.tvl / 1000000);
      });
      this.handleData(chartBuilder, [
        ['Profit K$', 'right', '#0085ff'],
        ['Reward $', '1', '#eeb000'],
        ['TVL M$', '2', '#7e7e7e']
      ]);
    });
  }
}
