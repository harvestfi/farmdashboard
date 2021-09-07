import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ChartGeneralMethodsComponent} from '../../chart/chart-general-methods.component';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {HardworksService} from '@data/services/http/hardworks.service';
import {TvlsService} from '@data/services/http/tvls.service';
import {ChartBuilder} from '../../chart/chart-builder';
import {StaticValues} from '@data/static/static-values';

@Component({
  selector: 'app-tvl-v2-dialog',
  templateUrl: './tvl-v2-dialog.component.html',
  styleUrls: ['./tvl-v2-dialog.component.scss']
})
export class TvlV2DialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
              private tvlService: TvlsService,
  ) {
    super(cdRef, vt);
  }

  load(): void {
    this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.network)).subscribe(data => {
      this.log.debug('History of All TVL loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(3);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastTvl / 1000000);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastOwnersCount);
        chartBuilder.addInData(2, dto.calculateTime, dto.lastPrice);
      });
      this.handleData(chartBuilder, [
        ['TVL M$', 'right', '#5CADAA'],
        ['Accounts', '1', '#7e7e7e'],
        ['FARM Price', '2', '#eeb000'],
      ]);
    });
  }
}
