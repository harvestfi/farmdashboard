import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {environment} from '../../../environments/environment';
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { IChartApi } from 'lightweight-charts';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.css']
})
export class IncomeDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input('data') public data: Record<any, any>;
  ready = false;
  chart: IChartApi;

  constructor(private httpService: HttpService,
              public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
                super();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.httpService.getHardWorkHistoryDataByName(this.data.name).subscribe(data => {
      this.log.debug('History of All Incomes loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(3);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.blockDate, (dto.fullRewardUsdTotal * 0.7) / 1000);
        chartBuilder.addInData(1, dto.blockDate, dto.apr);
        chartBuilder.addInData(2, dto.blockDate, dto.tvl / 1000000);
      });
      this.handleData(chartBuilder, [
        ['Profit K$', 'right', '#0085ff'],
        ['Call APR %', '1', '#eeb000'],
        ['TVL M$', '2', '#7e7e7e']
      ]);
    });
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(this.chart, config);
  }
}
