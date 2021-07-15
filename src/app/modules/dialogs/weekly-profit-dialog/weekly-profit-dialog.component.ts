import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '@modules/chart/chart-general-methods.component';
import {HardworksService} from '@data/services/http/hardworks.service';
import {StaticValues} from '@data/static/static-values';

@Component({
  selector: 'app-weekly-profit-dialog',
  templateUrl: './weekly-profit-dialog.component.html',
  styleUrls: ['./weekly-profit-dialog.component.scss']
})
export class WeeklyProfitDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {


  option = {
        title: {
            text: ''
        },
      dataZoom: [
          {
              id: 'dataZoomX',
              type: 'slider',
              xAxisIndex: [0],
              filterMode: 'filter'
          },
          {
              id: 'dataZoomY',
              type: 'slider',
              yAxisIndex: [0],
              filterMode: 'empty'
          }
      ],
      responsive: true,
      maintainAspectRatio: false,
      tooltip: {
          backgroundColor: 'rgba(50,50,50,0.9)',
          textStyle: {
              color:  '#ffffff'
          },
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          },
          position: (pos, params, dom, rect, size) => {
              // tooltip will be fixed on the right if mouse hovering on the left,
              // and on the left if hovering on the right.
           const obj = {top: 0};
           obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
           return obj;
          },
          order: 'valueDesc'
      },
      legend: {
          data: [],
          textStyle: {
              fontSize: '14px',
              color: '#498ecb'
          },
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      grid: {
          left: '3%',
          right: '6%',
          bottom: '12%',
          top: '15%',
          containLabel: true,
      },
      xAxis: [
          {
              type: 'category',
              boundaryGap: false,
              data: []
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: []
    };

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
  ) {
    super(cdRef, vt);
  }

  load(): void {
    this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network)).subscribe(data => {
      this.log.debug('History of All Profits loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, (dto.weeklyAllProfit) / 1000));
      data?.forEach(dto => chartBuilder.addInData(1, dto.blockDate, dto.allProfit / 1000000));
      this.handleData(chartBuilder, [
        ['Weekly Profit K$', 'right', '#0085ff'],
        ['All profit M$', '1', '#eeb000']
      ]);
      this.loadSecondChart(data);

    });
  }

  getPlatformFromVaultName(vaultName: string): string {
      if (vaultName.startsWith('V_')) {
          vaultName = vaultName.replace('V_', '');
      }
      const underscoreCount = vaultName.split('_')?.length ?? 0;
      let platform = 'SINGLE';
      if (underscoreCount > 2) {
          platform = vaultName.split('_')[0];
      } else if (vaultName.indexOf('CRV') >= 0) {
          platform = 'CRV';
      }
      return platform;
  }

  getCurrentDate(item): string {
      const date = new Date(item.blockDate * 1000);
      const currentDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');
      return currentDate;
  }

  loadSecondChart(data): void {
      const times: Array<string> = data.map(item => this.getCurrentDate(item));

      this.option.xAxis[0].data = times;
      const groups = data.reduce((acc, item) => {
          const vaultName = item.vault;
          const platform = this.getPlatformFromVaultName(vaultName);
          if (!acc[platform]) {
              acc[platform] = [];
          }
          acc[platform].push(item);
          return acc;
      }, {});

      let seriesCounter = 0;
      this.option.legend.data = [];
      this.option.series = [];
      for (const key in groups) {
          if (groups.hasOwnProperty(key)) {
              this.option.series.push({
                  name: key,
                  type: 'line',
                  areaStyle: {},
                  emphasis: {
                      focus: 'series'
                  },
                  data: []
              });
              const newDataList = [];

              for (const i of times) {
                  let value = 0;
                  for (const j of groups[key]) {
                      const currentDate = this.getCurrentDate(j);
                      if (i === currentDate) {
                          value = j.fullRewardUsdTotal / 1000;
                      }
                  }
                  newDataList.push(value);
              }
              this.option.series[seriesCounter].data = newDataList;
              this.option.legend.data.push(key);
              seriesCounter = seriesCounter + 1;
          }
      }
  }
}
