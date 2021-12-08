import {IChartApi} from 'lightweight-charts';
import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {ChartsOptionsLight} from './charts-options-light';
import {ChartBuilder} from './chart-builder';
import {ChartGeneralComponent} from './chart-general/chart-general.component';
import { filter, takeUntil } from 'rxjs/operators';
import { DestroyService } from '@data/services/destroy.service';

@Component({
  selector: 'app-general-methods',
  template: ``,
  providers: [DestroyService],
})
export abstract class ChartGeneralMethodsComponent implements OnInit, AfterViewInit {
  public chart: IChartApi;
  @ViewChild(ChartGeneralComponent) public chartComponent: ChartGeneralComponent;
  public ready = false;
  public network = 'eth';

  constructor(
    public cdRef: ChangeDetectorRef,
    public vt: ViewTypeService,
    protected destroy$: DestroyService,
  ) {
  }

  ngOnInit(): void {
    this.vt.events$
      .pipe(
        filter(event => event === 'theme-changed'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
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
    if (this.chartComponent.chartEl) {
        this.chart = chartBuilder.initChart(this.chartComponent.chartEl);
        chartBuilder.addToChart(this.chart, config);
    }
  }

  setNetwork(networkName: string): void {
    this.network = networkName;
    this.clear();
    this.load();
  }

  abstract load(): void;

  clear(): void {
    if (this.chart) {
        this.chart.remove();
    }
    this.ready = false;
  }
}
