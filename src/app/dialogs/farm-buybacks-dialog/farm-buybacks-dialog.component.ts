import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '../../chart/chart-general-methods.component';
import { IChartApi } from 'lightweight-charts';
import {HardworksService} from '../../services/http/hardworks.service';
import {TvlsService} from '../../services/http/tvls.service';
@Component({
  selector: 'app-farm-buybacks-dialog',
  templateUrl: './farm-buybacks-dialog.component.html',
  styleUrls: ['./farm-buybacks-dialog.component.css']
})
export class FarmBuybacksDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input() public data: Record<any, any>;
  ready = false;
  chart: IChartApi;


  constructor(public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
              private tvlsService: TvlsService,
              ) {
                super();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.hardworksService.getHardWorkHistoryData().subscribe(data => {
      this.log.debug('History of All Farm buybacks loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, dto.farmBuybackSum / 1000));

      this.tvlsService.getHistoryTvlByVault('PS').subscribe(vaultData => {
            this.log.debug('History of PS TVL loaded ', vaultData);
            vaultData?.forEach(dto => chartBuilder.addInData(1, dto.calculateTime, dto.sharePrice / 1000));
            this.handleData(chartBuilder, [
              ['FARM Buyback K', 'right', '#0085ff'],
              ['All supply K', '1', '#efa4a4']
            ]);
          }
      );
    });
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(this.chart, config);
  }
}
