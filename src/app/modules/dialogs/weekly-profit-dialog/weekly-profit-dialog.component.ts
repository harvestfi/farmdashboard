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
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
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
            right: '4%',
            bottom: '3%',
            top: '30%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
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
      console.log(data);
      this.loadSecondChart(data);

    });
  }

  loadSecondChart(data): void {
      const times: Array<string> = data.map(item => {
          const date = new Date(item.blockDate * 1000);
          const currentDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');
          return currentDate;
      });
      this.option.xAxis[0]['data'] = times;
      const group = data.reduce((acc, item) => {
          if (!acc[item.vault.split('_')[0]]) {
              if (item.vault.split('_').length > 1) {
                  acc[item.vault.split('_')[0]] = [];
              } else {
                  acc['UNKNOWN'] = [];
              }
          }
          if (item.vault.split('_').length > 1) {
              acc[item.vault.split('_')[0]].push(item);
          } else {
              if (!acc['UNKNOWN']) {
                  acc['UNKNOWN'] = [];
              }
              acc['UNKNOWN'].push(item);
          }
          return acc;
      }, {});
      console.log(group);
      let variablesCounter = 0;
      for (const key in group) {
          if (group.hasOwnProperty(key)) {
              this.option.series.push({
                  name: key,
                  type: 'line',
                  stack: '总量',
                  areaStyle: {},
                  emphasis: {
                      focus: 'series'
                  },
                  data: []
              });
              const newDataList = [];

              for (const i of times) {
                  let value = 0;
                  for (const j of group[key]) {
                      const date = new Date(j.blockDate * 1000);
                      const currentDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');
                      if (i === currentDate) {
                          value = j.weeklyAllProfit / 1000;
                      }
                  }
                  newDataList.push(value);
              }
              this.option.series[variablesCounter].data = newDataList;
              this.option.legend.data.push(key);
              variablesCounter = variablesCounter + 1;
          }
      }
  }
}
