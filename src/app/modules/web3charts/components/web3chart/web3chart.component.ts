import { ViewTypeService } from '@data/services/view-type.service';
import { IChartApi } from 'lightweight-charts';
import { ChartBuilder } from '@modules/chart/chart-builder';
import { ChartGeneralMethodsComponent } from '@modules/chart/chart-general-methods.component';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartData } from '@modules/web3charts/web3charts.component';
import { DestroyService } from '@data/services/destroy.service';

@Component({
  selector: 'app-web3chart',
  templateUrl: './web3chart.component.html',
  styleUrls: ['./web3chart.component.css'],
  providers: [DestroyService],
})
export class Web3chartComponent extends ChartGeneralMethodsComponent implements OnChanges {
  @ViewChild('chart') chartEl: ElementRef;
  @Input('data') public data: Array<ChartData>;
  @Input('title') public title: string;
  chart: IChartApi;

  constructor(
    public cdRef: ChangeDetectorRef,
    public vt: ViewTypeService,
    protected destroy$: DestroyService,
  ) {
    super(cdRef, vt, destroy$);
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

  load(): void {
  }
}
