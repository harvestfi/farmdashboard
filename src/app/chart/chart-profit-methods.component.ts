import {IChartApi} from 'lightweight-charts';
import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ViewTypeService} from '../services/view-type.service';
import {ChartsOptionsLight} from './charts-options-light';
import {ChartBuilder} from './chart-builder';
import {WeeklyProfitChartComponent} from './weekly-profit-chart/weekly-profit-chart.component';

@Component({
  selector: 'app-profit-methods',
  template: ``
})
export abstract class ChartProfitMethodsComponent implements OnInit, AfterViewInit {
  public chart: IChartApi;
  @ViewChild(WeeklyProfitChartComponent) public chartComponent: WeeklyProfitChartComponent;
  public ready = false;
  public network = 'eth';

  constructor(public cdRef: ChangeDetectorRef,
              public vt: ViewTypeService) {
  }

  ngOnInit(): void {
    this.vt.events$.subscribe(event => {
      if (event === 'theme-changed') {
        this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
      }
    });
  }

  ngAfterViewInit(): void {
    this.load();
  }

  @HostListener('window:resize', ['$event'])
  handleScreenResize($event: any): void {
    this.chart?.resize(this.chartComponent.chartEl?.nativeElement?.clientWidth,
        this.chartComponent.chartEl?.nativeElement?.clientHeight);
  }

  handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    this.chart = chartBuilder.initChart(this.chartComponent.chartEl);
    chartBuilder.addToChart(this.chart, config);
  }

  setNetwork(networkName: string) {
    this.network = networkName;
    this.clear();
    this.load();
  }

  abstract load();

  clear() {
    this.chart.remove();
    this.ready = false;
  }
}
