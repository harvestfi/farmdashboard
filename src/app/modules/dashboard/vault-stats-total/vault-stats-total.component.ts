import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewTypeService } from '@data/services/view-type.service';
import { ChartSeries } from '@modules/dashboard/vault-stats/models/chart-series.model';
import { StaticValues } from '@data/static/static-values';
import { HardworksService } from '@data/services/http/hardworks.service';
import { HardWorkDto } from '@data/models/hardwork-dto';
import { TvlsService } from '@data/services/http/tvls.service';
import { HarvestsService } from '@data/services/http/harvests.service';
import { EChartsOption } from 'echarts/types/src/export/option';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PriceDataService } from '@data/services/data/price-data.service';
import { Addresses } from '@data/static/addresses';
import { format, parse, getISOWeek, getYear, getMonth, endOfWeek, startOfWeek, getDate } from 'date-fns';

export interface ChartItem {
  name: string;
  value: Array<string>;
  date: string;
  sum: string;
}

@Component({
  selector: 'app-vault-stats-total',
  templateUrl: './vault-stats-total.component.html',
  styleUrls: ['./vault-stats-total.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultStatsTotalComponent implements OnInit {
  networks = ['eth', 'bsc'];

  totalDataTVL: ChartSeries[] = [];
  totalDataProfit: ChartSeries[] = [];
  totalDataProfitByMonths: ChartSeries[] = [];
  totalDataProfitByWeeks: ChartSeries[] = [];
  totalUsers: ChartSeries[] = [];
  totalFarmStacked: ChartSeries[] = [];

  options1: EChartsOption;
  options2: EChartsOption;
  options3: EChartsOption;
  options4: EChartsOption;

  title1 = 'Total TVL';
  title2 = 'Total Profits';
  title3 = 'Users';
  title4 = 'Farm Stacked';

  valueSymbol1 = '$';
  valueSymbol2 = '$';
  valueSymbol3 = '';
  valueSymbol4 = '';

  selectedPeriod1 = 0;
  selectedPeriod2 = 0;
  selectedPeriod3 = 0;
  selectedPeriod4 = 0;

  tvlTotalSelectedValue = '';
  tvlTotalSelectedDate = '';
  profitTotalSelectedValue = '';
  profitTotalSelectedDate = '';
  usersSelectedValue = '';
  usersSelectedDate = '';
  farmStackedSelectedValue = '';
  farmStackedSelectedDate = '';

  changesTvlTotalInPercent = '';
  changesTvlTotalInAmount = '';
  changesProfitTotalInAmount = '';
  changesUsersInAmount = '';
  changesUsersInPercent = '';
  changesFarmBuyBackInAmount = '';
  changesFarmBuyBackInPercent = '';
  changesFarmStackedInAmount = '';
  changesFarmStackedInPercent = '';

  isLoadingTvlUserCharts = false;
  isLoadingProfitChart = false;
  isLoadingFarmStackedChart = false;

  updateDataTotalProfit: EChartsOption;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private harvestService: HarvestsService,
    private hardworksService: HardworksService,
    private tvlService: TvlsService,
    private priceDataService: PriceDataService,
    public viewTypeService: ViewTypeService) {
  }

  ngOnInit(): void {
    this.loadTVLHistoryData();
    this.loadHardWorkHistoryData();
    this.loadStackedData();
  }

  loadTVLHistoryData(): void {
    this.isLoadingTvlUserCharts = true;

    this.changeDetectorRef.detectChanges();

    forkJoin([
      this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.networks[0])),
      this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.networks[1])),
    ])
      .subscribe(([data, data2]) => {
        if (data.length && data2.length) {
          const totalDataTVL = this.prepareData(data, 'lastTvl', 'calculateTime');
          const totalDataTVL2 = this.prepareData(data2, 'lastTvl', 'calculateTime');
          const totalUsers = this.prepareData(data, 'lastOwnersCount', 'calculateTime');
          const totalUsers2 = this.prepareData(data2, 'lastOwnersCount', 'calculateTime');
          const totalUsersArray = [...totalUsers, ...totalUsers2].sort(this.sortDate);
          const totalArray = [...totalDataTVL, ...totalDataTVL2].sort(this.sortDate);
          const paredArray = this.findNotParedDay(totalArray);
          const paredUsersArray = this.findNotParedDay(totalUsersArray);
          this.totalDataTVL = this.combineNetworks(totalArray);
          this.totalUsers = this.combineNetworks(totalUsersArray);

          this.initializeChartTotalTVL();
          this.initializeChartUsers();

          this.changesUsersInAmount = this.lastChanges(this.totalUsers).amountChanges;
          this.changesUsersInPercent = this.lastChanges(this.totalUsers).percentChanges;
          this.changesTvlTotalInAmount = this.lastChanges(this.totalDataTVL).amountChanges;
          this.changesTvlTotalInPercent = this.lastChanges(this.totalDataTVL).percentChanges;

          this.isLoadingTvlUserCharts = false;

          this.changeDetectorRef.detectChanges();
        }
      }, err => {
        console.log(err);
      });
  }

  loadStackedData(): void {
    this.isLoadingFarmStackedChart = true;

    this.changeDetectorRef.detectChanges();

    this.tvlService.getHistoryTvlByVault(Addresses.ADDRESSES.get('PS'))
      .subscribe((data) => {
        const totalFarmStacked = this.prepareFarmStackedData(data, 'calculateTime');
        this.totalFarmStacked = totalFarmStacked.sort(this.sortDate);
        this.initializeChartFarmStacked();
        this.changesFarmStackedInAmount = this.lastChanges(this.totalFarmStacked).amountChanges;
        this.changesFarmStackedInPercent = this.lastChanges(this.totalFarmStacked).percentChanges;

        this.isLoadingFarmStackedChart = false;

        this.changeDetectorRef.detectChanges();
      }, err => {
        console.log(err);
      });
  }

  loadHardWorkHistoryData(): void {
    this.isLoadingProfitChart = true;

    this.changeDetectorRef.detectChanges();

    forkJoin([
      this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.networks[0]), 1),
      this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.networks[1]), 1),
    ])
      .subscribe(([data, data2]) => {
        const sorted = [...data, ...data2].sort((a, b) => new Date(a.blockDate).getTime() - new Date(b.blockDate).getTime());
        const weeks = new Map<string, any>();
        const months = new Map<string, any>();

        sorted.forEach(it => {
          const date = new Date(it.blockDate * 1000);
          const weekStart = startOfWeek(date, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
          const weekLabel = `${getDate(weekStart)}.${getMonth(weekStart) + 1}-${getDate(weekEnd)}.${getMonth(weekEnd) + 1}`;
          const monthLabel = `${getMonth(date) + 1}.${getYear(date)}`;
          const week = getISOWeek(date);
          const month = getMonth(date) + 1;
          const year = getYear(date);
          const keyWeek = `${year}${week}`;
          const keyMonth = `${year}${month}`;
          const tooltipWeekLabel = `${getDate(weekStart)} ${format(date, 'LLLL')} ${year}`
            + `- ${getDate(weekEnd)} ${format(date, 'LLLL')} ${year}`;
          const tooltipMonthLabel = `${format(date, 'LLLL')} ${year}`;

          const sumWeek = weeks.has(keyWeek) ? weeks.get(keyWeek).sum + it.fullRewardUsd : it.fullRewardUsd;

          weeks.set(keyWeek, {
            date,
            name: date,
            sum: sumWeek,
            value: [weekLabel, sumWeek],
            dateTooltip: tooltipWeekLabel,
          });

          const sumMonths = months.has(keyMonth) ? months.get(keyMonth).sum + it.fullRewardUsd : it.fullRewardUsd;

          months.set(keyMonth, {
            date,
            name: date,
            sum: sumMonths,
            value: [monthLabel, sumMonths],
            dateTooltip: tooltipMonthLabel,
          });
        });

        this.totalDataProfitByWeeks = Array.from(weeks.values());
        this.totalDataProfitByMonths = Array.from(months.values());

        this.totalDataProfit = this.totalDataProfitByMonths;

        this.initializeChartTotalProfit();

        this.isLoadingProfitChart = false;

        this.changeDetectorRef.detectChanges();
      }, err => {
        console.log(err);
      });
  }

  initializeChartTotalTVL(): void {
    let temp = '';
    this.options1 = {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          params = params[0];
          if (params.value[1] !== temp) {
            temp = params.value[1];
          } else {
            return '';
          }
          const date = new Date(params.name);
          const roundedSum = this.nFormatter(temp, 2);
          this.tvlTotalSelectedValue = '$' + roundedSum;
          this.tvlTotalSelectedDate = date.toString();

          this.changeDetectorRef.markForCheck();

          return ``;
        },
        backgroundColor: 'rgb(25, 27, 31)',
        borderWidth: 0,
        position: [-10, 25],
        extraCssText: 'box-shadow: none',
      },
      grid: {
        top: '26%',
        left: '3.5%',
        right: '50',
        bottom: '12%',
      },
      axisPointer: {
        lineStyle: {
          type: 'solid',
          color: '#2c2f36',
        },
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d2d5',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#9fa3a3',
          fontSize: '12px',
          fontFamily: 'Inter var',
          formatter: (value => this.selectedPeriod1 === 1 ? format(value, 'dd.MM') : format(value, 'MM.yy')),
          showMinLabel: true,
          showMaxLabel: true,
        },
        boundaryGap: false,
      },
      yAxis: {
        position: 'right',
        type: 'value',
        offset: 0,
        splitLine: {
          show: true,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d2d5',
          },
        },
        axisLabel: {
          color: '#9fa3a3',
          fontSize: '12px',
          fontFamily: 'Inter var',
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value) => this.nFormatter(value, 2),
        },
        axisTick: {
          show: true,
          inside: true,
          length: 10,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
      },
      series: [{
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: this.totalDataTVL,
        lineStyle: {
          width: 0.5,
        },
        itemStyle: {
          color: '#5CADAA',
        },
        areaStyle: {
          color: '#5CADAA',
          opacity: 0.9,
        },
      }],
    };
  }

  initializeChartTotalProfit(): void {
    this.options2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: ([params]) => {
          const roundedSum = this.nFormatter(params.value[1], 2);
          this.profitTotalSelectedValue = '$' + roundedSum;
          this.profitTotalSelectedDate = params.data.dateTooltip;

          this.changeDetectorRef.markForCheck();

          return ``;
        },
        backgroundColor: 'rgb(25, 27, 31)',
        borderWidth: 0,
        position: [-10, 25],
        extraCssText: 'box-shadow: none',
      },
      grid: {
        top: '26%',
        left: '4.5%',
        right: '50',
        bottom: '12%',
      },
      xAxis: [
        {
          type: 'category',
          splitLine: {
            show: false,
            lineStyle: {
              type: [7],
              color: '#d1d2d5',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#d1d2d5',
            },
          },
          axisLabel: {
            rotate: 90,
            color: '#9fa3a3',
            fontSize: '8px',
            fontFamily: 'Inter var',
            margin: 5,
            showMinLabel: true,
            showMaxLabel: true,
          },
        },
      ],
      yAxis: {
        position: 'right',
        type: 'value',
        offset: 0,
        splitLine: {
          show: true,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d2d5',
          },
        },
        axisLabel: {
          color: '#9fa3a3',
          fontSize: '12px',
          fontFamily: 'Inter var',
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value) => this.nFormatter(value, 2),
        },
        axisTick: {
          show: true,
          inside: true,
          length: 10,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
      },
      series: [{
        type: 'bar',
        barWidth: '90%',
        data: this.totalDataProfit,
        itemStyle: {
          color: '#5CADAA',
        },
      }],
    };
  }

  initializeChartUsers(): void {
    let temp = '';
    this.options3 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          params = params[0];
          if (params.value[1] !== temp) {
            temp = params.value[1];
          } else {
            return '';
          }
          const date = new Date(params.name);
          this.usersSelectedValue = this.nFormatter(temp, 2);
          this.usersSelectedDate = date.toString();

          this.changeDetectorRef.markForCheck();

          return ``;
        },
        backgroundColor: 'rgb(25, 27, 31)',
        borderWidth: 0,
        position: [-10, 25],
        extraCssText: 'box-shadow: none',
      },
      grid: {
        top: '26%',
        left: '4.5%',
        right: '50',
        bottom: '12%',
      },
      xAxis: [
        {
          type: 'time',
          splitLine: {
            show: false,
            lineStyle: {
              type: [7],
              color: '#d1d2d5',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#d1d2d5',
            },
          },
          axisLabel: {
            color: '#9fa3a3',
            fontSize: '12px',
            fontFamily: 'Inter var',
            formatter: (value => this.selectedPeriod3 === 1 ? format(value, 'dd.MM') : format(value, 'MM.yy')),
            showMinLabel: true,
            showMaxLabel: true,
          },
        },
      ],
      yAxis: {
        position: 'right',
        type: 'value',
        offset: 0,
        splitLine: {
          show: true,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d2d5',
          },
        },
        axisLabel: {
          color: '#9fa3a3',
          fontSize: '12px',
          fontFamily: 'Inter var',
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value) => this.nFormatter(value, 2),
        },
        axisTick: {
          show: true,
          inside: true,
          length: 10,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
      },
      series: [{
        type: 'bar',
        barWidth: '70%',
        data: this.totalUsers,
        itemStyle: {
          color: '#5CADAA',
        },
      }],
    };
  }

  initializeChartFarmStacked(): void {
    let temp = '';
    this.options4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          params = params[0];
          if (params.value[1] !== temp) {
            temp = params.value[1];
          } else {
            return '';
          }
          const date = new Date(params.name);
          this.farmStackedSelectedValue = this.nFormatter(temp, 2);
          this.farmStackedSelectedDate = date.toString();

          this.changeDetectorRef.markForCheck();

          return ``;
        },
        backgroundColor: 'rgb(25, 27, 31)',
        borderWidth: 0,
        position: [-10, 25],
        extraCssText: 'box-shadow: none',
      },
      grid: {
        top: '26%',
        left: '4.5%',
        right: '50',
        bottom: '12%',
      },
      xAxis: [
        {
          type: 'category',
          splitLine: {
            show: false,
            lineStyle: {
              type: [7],
              color: '#d1d2d5',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#d1d2d5',
            },
          },
          axisLabel: {
            color: '#9fa3a3',
            fontSize: '14px',
            fontFamily: 'Inter var',
            formatter: (value => {
              const parsedDate = parse(value, 'yyyy/M/dd', new Date());

              return this.selectedPeriod4 === 1
                ? format(parsedDate, 'dd.MM')
                : format(parsedDate, 'MM.yy');
            }),
            showMinLabel: true,
            showMaxLabel: true,
          },

        },
      ],
      yAxis: {
        position: 'right',
        type: 'value',
        offset: 0,
        splitLine: {
          show: true,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d2d5',
          },
        },
        axisLabel: {
          color: '#9fa3a3',
          fontSize: '12px',
          fontFamily: 'Inter var',
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value) => this.nFormatter(value, 2),
        },
        axisTick: {
          show: true,
          inside: true,
          length: 10,
          lineStyle: {
            type: [7],
            color: '#d1d2d5',
          },
        },
      },
      series: [{
        type: 'bar',
        barWidth: '70%',
        data: this.totalFarmStacked,
        itemStyle: {
          color: '#5CADAA',
        },
      }],
    };
  }

  combineNetworks(allNetworkData): ChartItem[] {
    return Object.values(allNetworkData.reduce((a, { name, value, date, sum }) => {
      a[date] = (a[date] || { name, value, date, sum: 0 });
      a[date].sum = String(Number(a[date].sum) + Number(sum));
      a[date].value[1] = a[date].sum;
      return a;
    }, {}));
  }

  prepareFarmBuyBack(data, valueField, dateField): ChartItem[] {
    return data.map((item) => {
      const date = new Date(item[dateField] * 1000);
      let bb = item[valueField];
      if (item.network === 'bsc') {
        const farmPrice = this.priceDataService.getLastFarmPrice();
        if (farmPrice && farmPrice !== 0) {
          bb = bb / farmPrice;
        } else {
          bb = 0;
        }
      }
      return {
        name: date.toString(),
        value: [
          [
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
          ].join('/'),
          bb.toString(),
        ],
        date: [
          date.getFullYear(), date.getMonth() + 1, date.getDate(),
        ].join('/'),
        sum: bb,
      };
    });
  }

  prepareDataCumulative(data, cumulative, dateField): ChartItem[] {
    return data.map((item: HardWorkDto) => {
      const date = new Date(item[dateField] * 1000);
      const curDate = [date.getFullYear(), date.getMonth() + 1].join('/');
      return {
        name: date.toString(),
        value: [
          curDate,
          cumulative.get(curDate).toString(),
        ],
        date: curDate,
        sum: cumulative.get(curDate).toString(),
      };
    });
  }


  prepareData(data, valueField, dateField): ChartItem[] {
    return data.map((item) => {
      const date = new Date(item[dateField] * 1000);
      return {
        name: date.toString(),
        value: [
          [
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
          ].join('/'),
          item[valueField].toString(),
        ],
        date: [
          date.getFullYear(), date.getMonth() + 1, date.getDate(),
        ].join('/'),
        sum: item[valueField].toString(),
      };
    });
  }

  prepareFarmStackedData(data, dateField): ChartItem[] {
    return data.map((item) => {
      const date = new Date(item[dateField] * 1000);
      return {
        name: date.toString(),
        value: [
          [
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
          ].join('/'),
          ((item.lastTvlNative / item.sharePrice) * 100).toString(),
        ],
        date: [
          date.getFullYear(), date.getMonth() + 1, date.getDate(),
        ].join('/'),
        sum: ((item.lastTvlNative / item.sharePrice) * 100).toString(),
      };
    });
  }

  sortDate(a, b): number {
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  }

  findNotParedDay(totalArray): ChartItem[] {
    const paredList = [];
    const result = totalArray.reduce((acc, o) => (acc[o.date] = (acc[o.date] || 0) + 1, acc), {});

    for (const i of totalArray) {
      if (result[i.date] === 2) {
        paredList.push(i);
      }
    }
    return paredList;
  }

  lastChanges(data): { minus: boolean; amountChanges: string; percentChanges: string } {
    const lastChanges = +data[data.length - 1].value[1] - +data[data.length - 2].value[1];
    const previousNumber = +data[data.length - 2].value[1];
    let minus = false;
    let amountChanges = '';
    let percentChanges = '';
    if (lastChanges < 0) {
      minus = true;
    }
    if (minus) {
      amountChanges = this.nFormatter(lastChanges * (-1), 2);
    } else {
      amountChanges = this.nFormatter(lastChanges, 2);
    }
    const finalPercent = Math.abs(lastChanges / previousNumber * 100);
    if (finalPercent >= 1) {
      percentChanges = this.nFormatter(finalPercent.toString(), 2);
    } else {
      percentChanges = finalPercent.toFixed(2);
    }
    return {
      minus,
      amountChanges,
      percentChanges,
    };
  }

  nFormatter(num, digits): string {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'b' },
      { value: 1e12, symbol: 't' },
      { value: 1e15, symbol: 'p' },
      { value: 1e18, symbol: 'e' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find((it) => num >= it.value);
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0.00';
  }

  dataReducer(data, length): ChartItem[] {
    let tempArray = [...data].reverse();
    tempArray = tempArray.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.value[0] === thing.value[0]
        )),
    );
    if (tempArray.length > length) {
      return tempArray.reverse().slice(tempArray.length - length);
    } else {
      return tempArray.reverse();
    }
  }

  onChangePeriod(optionsNumber, period): void {
    this[`selectedPeriod` + optionsNumber] = period;

    if (optionsNumber === 2) {
      this.totalDataProfit = period === 0 ? this.totalDataProfitByMonths : this.totalDataProfitByWeeks;

      this.changeDetectorRef.detectChanges();
    }
  }
}
