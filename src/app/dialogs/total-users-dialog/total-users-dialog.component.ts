import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import { ChartGeneralMethods } from 'src/app/chart/chart-general-methods';

@Component({
  selector: 'app-total-users-dialog',
  templateUrl: './total-users-dialog.component.html',
  styleUrls: ['./total-users-dialog.component.css']
})
export class TotalUsersDialogComponent extends ChartGeneralMethods implements AfterViewInit {
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
    this.httpService.getHistoryAllTvl().subscribe(data => {
      this.log.debug('History of All Harvests loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastAllOwnersCount);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastTvl);
      });

      this.handleData(chartBuilder, [
        ['Total users', 'right', '#0085ff'],
        ['TVL', '1', '#eeb000']
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
