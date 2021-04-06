import {IChartApi} from 'lightweight-charts';
import {HostListener, Component, ElementRef, OnInit} from '@angular/core';
import { ViewTypeService } from '../services/view-type.service';
import { ChartsOptionsLight } from './charts-options-light';
@Component({
    selector: 'app-general-methods',
    template: ``
  })
export abstract class ChartGeneralMethodsComponent implements OnInit {
    chart: IChartApi;
    chartEl: ElementRef;
    public vt: ViewTypeService = new ViewTypeService();

    ngOnInit(): void{
        this.vt.events$.subscribe(event => {
            if (event === 'theme-changed'){
                this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    handleScreenResize($event: any): void {
        this.chart?.resize(this.chartEl?.nativeElement?.clientWidth, this.chartEl?.nativeElement?.clientHeight);
    }
}
