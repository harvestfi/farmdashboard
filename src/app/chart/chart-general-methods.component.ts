import {IChartApi} from 'lightweight-charts';
import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ViewTypeService} from '../services/view-type.service';
import {ChartsOptionsLight} from './charts-options-light';
import {ChartBuilder} from './chart-builder';

@Component({
    selector: 'app-general-methods',
    template: ``
})
export abstract class ChartGeneralMethodsComponent implements OnInit {
    public chart: IChartApi;
    @ViewChild('chart') public chartEl: ElementRef;
    public ready = false;

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

    @HostListener('window:resize', ['$event'])
    handleScreenResize($event: any): void {
        this.chart?.resize(this.chartEl?.nativeElement?.clientWidth, this.chartEl?.nativeElement?.clientHeight);
    }

    handleData(chartBuilder: ChartBuilder, config: string[][]): void {
        this.ready = true;
        this.cdRef.detectChanges();
        this.chart = chartBuilder.initChart(this.chartEl);
        chartBuilder.addToChart(this.chart, config);
    }
}
