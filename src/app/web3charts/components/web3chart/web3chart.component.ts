import {ViewTypeService} from 'src/app/services/view-type.service';
import {IChartApi} from 'lightweight-charts';
import {ChartBuilder} from '../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';
import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-web3chart',
  templateUrl: './web3chart.component.html',
  styleUrls: ['./web3chart.component.css']
})
export class Web3chartComponent extends ChartGeneralMethodsComponent implements OnInit, OnChanges {
  @ViewChild('chart') chartEl: ElementRef;
  @Input('data') public data: Array<{ timestamp: number; value: number }>;
  @Input('title') public title: string;
  chart: IChartApi;

  constructor(
      public cdRef: ChangeDetectorRef,
      public vt: ViewTypeService
  ) {
    super(cdRef, vt);
  }

  ngOnInit(): void {
  }

  ngOnChanges(props): void {
    this.handleData(props.data.currentValue);
  }

  handleData(data): void {
    if (data === null) {
      return;
    }

    if (this.chart) {
      this.chart.remove();
    }

    const chartBuilder = new ChartBuilder();
    chartBuilder.initVariables(1);
    data.forEach(el => {
      chartBuilder.addInData(0, el.timestamp, el.value);
    });

    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(this.chart, [[this.title, 'right', '#7e7e7e']]);
  }
}
