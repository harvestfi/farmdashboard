import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {IChartApi} from 'lightweight-charts';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';

@Component({
  selector: 'app-profit-dialog',
  templateUrl: './profit-dialog.component.html',
  styleUrls: ['./profit-dialog.component.css']
})
export class ProfitDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input() public data: Record<any, any>;
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
    this.httpService.getHardWorkHistoryData().subscribe(data => {
      this.log.debug('History of All Profits loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(1);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, (dto.weeklyAllProfit / 0.7) / 1000));
      // data?.forEach(dto => chartBuilder.addInData(1, dto.blockDate, dto.tvl / 1000000));
      this.handleData(chartBuilder, [
        ['Weekly Profit K$', 'right', '#0085ff'],
        // ['TVL M$', '1', '#7e7e7e']
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
