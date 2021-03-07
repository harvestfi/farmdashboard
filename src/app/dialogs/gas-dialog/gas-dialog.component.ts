import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { IChartApi } from 'lightweight-charts';

@Component({
  selector: 'app-gas-dialog',
  templateUrl: './gas-dialog.component.html',
  styleUrls: ['./gas-dialog.component.css']
})
export class GasDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input('data') public data: Record<any, any>;
  ready = false;

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
    this.httpService.getLastTvls().subscribe(data => {
      this.log.debug('Gas price history ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(1);
      data?.sort((a, b) => (a.blockDate > b.blockDate) ? 1 : -1).forEach(dto => {
          chartBuilder.addInData(0, dto.blockDate, dto.lastGas);
      });
      this.handleData(chartBuilder, [
        ['Gas price', 'right', '#0085ff'],
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
