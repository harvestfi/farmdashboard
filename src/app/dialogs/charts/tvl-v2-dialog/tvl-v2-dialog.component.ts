import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ChartGeneralMethodsComponent} from '../../../chart/chart-general-methods.component';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {HardworksService} from '../../../services/http/hardworks.service';
import {TvlsService} from '../../../services/http/tvls.service';
import {ChartBuilder} from '../../../chart/chart-builder';
import {StaticValues} from '../../../static/static-values';
import {ChartGeneralComponent} from '../../../chart/chart-general/chart-general.component';

@Component({
  selector: 'app-tvl-v2-dialog',
  templateUrl: './tvl-v2-dialog.component.html',
  styleUrls: ['./tvl-v2-dialog.component.css']
})
export class TvlV2DialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
              private tvlService: TvlsService,) {
    super(cdRef, vt);
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.network)).subscribe(data => {
      this.log.debug('History of All TVL loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(3);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastTvl / 1000000);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastAllOwnersCount);
        chartBuilder.addInData(2, dto.calculateTime, dto.lastPrice);
      });
      this.handleData(chartBuilder, [
        ['TVL M$', 'right', '#0085ff'],
        ['Accounts', '1', '#7e7e7e'],
        ['FARM Price', '2', '#eeb000'],
      ]);
    });
  }
}
