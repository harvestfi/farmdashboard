import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component';
import { IChartApi } from 'lightweight-charts';

interface FeeVaults {
  fee: number;
  vaults: number;
}

@Component({
  selector: 'app-gas-dialog',
  templateUrl: './gas-dialog.component.html',
  styleUrls: ['./gas-dialog.component.css']
})
export class GasDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
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
    this.httpService.getLastTvls().subscribe(data => {
      this.log.debug('Gas fees history ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      const dates = [];
      const dateData : Record<string, FeeVaults> = {};
      data?.forEach(dto => {
        if (dateData[dto.blockDate] === undefined) {
          dates.push(dto.blockDate); // use to sort if necessary
          dateData[dto.blockDate] = {
            fee: 0.0,
            vaults: 0,
          };
        }
        dateData[dto.blockDate].fee += dto.lastGas;
        dateData[dto.blockDate].vaults++;
      });
      for (const date of dates.sort()) {
        chartBuilder.addInData(0, date, dateData[date].fee/* / dateData[date].vaults*/);
        chartBuilder.addInData(1, date, dateData[date].vaults);
      }
      this.handleData(chartBuilder, [
        ['Fees', 'right', '#0085ff'],
        ['Vaults', '1', '#7e7e7e']
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
