import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {DialogData} from '../dialog-data';

@Component({
  selector: 'app-farm-buybacks-dialog',
  templateUrl: './farm-buybacks-dialog.component.html',
  styleUrls: ['./farm-buybacks-dialog.component.css']
})
export class FarmBuybacksDialogComponent implements AfterViewInit {
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
    this.httpService.getHardWorkHistoryData().subscribe(data => {
      this.log.debug('History of All Farm buybacks loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, dto.farmBuybackSum / 1000));

      this.httpService.getHistoryTvlByVault('PS').subscribe(vaultData => {
            this.log.debug('History of PS TVL loaded ', vaultData);
            vaultData?.forEach(dto => chartBuilder.addInData(1, dto.calculateTime, dto.sharePrice / 1000));
            this.handleData(chartBuilder, [
              ['FARM Buyback K', 'right', '#0085ff'],
              ['All supply K', '1', '#efa4a4']
            ]);
          }
      );
    });
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    const chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(chart, config);
  }
}
