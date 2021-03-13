import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {DialogData} from '../dialog-data';
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { IChartApi } from 'lightweight-charts';

@Component({
  selector: 'app-simple-chart-dialog',
  templateUrl: './simple-chart-dialog.component.html',
  styleUrls: ['./simple-chart-dialog.component.css']
})
export class SimpleChartDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @Input('data') data: DialogData;
  chart: IChartApi;
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
    this.log.info('Create a chart form', this.data);
    const chartBuilder = new ChartBuilder();
    chartBuilder.initVariables(this.data.data.length);
    this.data.data.forEach((arr, i) => {
      if (!arr) {
        return;
      }
      arr.forEach(el => {
        chartBuilder.addInData(i, el[0], el[1]);
      });
    });
    this.handleData(chartBuilder, this.data.config);
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(this.chart, config);
  }

}
