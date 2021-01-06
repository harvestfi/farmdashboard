import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../../dashboard/dashboard-last-values/dashboard-last-values.component';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';

@Component({
  selector: 'app-total-users-dialog',
  templateUrl: './total-users-dialog.component.html',
  styleUrls: ['./total-users-dialog.component.css']
})
export class TotalUsersDialogComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  ready = false;

  constructor(private httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
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
    const chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(chart, config);
  }
}
