import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewTypeService } from '@data/services/view-type.service';
import { ChartSeries } from '@modules/dashboard/vault-stats/models/chart-series.model';
import { StaticValues } from '@data/static/static-values';
import { HardworksService } from '@data/services/http/hardworks.service';
import { HardWorkDto } from '@data/models/hardwork-dto';
import { TvlsService } from '@data/services/http/tvls.service';
import { HarvestsService } from '@data/services/http/harvests.service';
import {EChartsOption} from 'echarts/types/src/export/option';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PriceDataService } from '@data/services/data/price-data.service';
import { Addresses } from '@data/static/addresses';
import moment from 'moment';

export interface ChartItem {
    name: string;
    value: Array<string>;
    date: string;
    sum: string;
}

@Component({
  selector: 'app-vault-stats-total',
  templateUrl: './vault-stats-total.component.html',
  styleUrls: ['./vault-stats-total.component.scss']
})
export class VaultStatsTotalComponent implements OnInit {

    networks = ['eth', 'bsc'];

    totalDataTVL: ChartSeries[] = [];
    totalDataProfit: ChartSeries[] = [];
    totalUsers: ChartSeries[] = [];
    totalFarmBuyBack: ChartSeries[] = [];

    totalFarmStacked: ChartSeries[] = [];

    options1: EChartsOption;
    options2: EChartsOption;
    options3: EChartsOption;
    options4: EChartsOption;
    options5: EChartsOption;
    options6: EChartsOption;

    title1 = 'Total TVL';
    title2 = 'Total Profits';
    title3 = 'Users';
    title4 = 'Farm Buybacks';
    title5 = 'P/E Ratio';
    title6 = 'Farm Stacked';

    valueSymbol1 = '$';
    valueSymbol2 = '$';
    valueSymbol3 = '';
    valueSymbol4 = '$';
    valueSymbol5 = '$';
    valueSymbol6 = '';

    selectedPeriod1 = 0;
    selectedPeriod2 = 0;
    selectedPeriod3 = 0;
    selectedPeriod6 = 0;

    tvlTotalSelectedValue = '';
    tvlTotalSelectedDate = '';
    profitTotalSelectedValue = '';
    profitTotalSelectedDate = '';
    usersSelectedValue = '';
    usersSelectedDate = '';
    farmBuyBackSelectedValue = '';
    farmBuyBackSelectedDate = '';
    farmStackedSelectedValue = '';
    farmStackedSelectedDate = '';


    changesTvlTotalInPercent = '';
    changesTvlTotalInAmount = '';
    changesProfitTotalInPercent = '';
    changesProfitTotalInAmount = '';
    changesUsersInAmount = '';
    changesUsersInPercent = '';
    changesFarmBuyBackInAmount = '';
    changesFarmBuyBackInPercent = '';
    changesFarmStackedInAmount = '';
    changesFarmStackedInPercent = '';


    minus1 = false;
    minus2 = false;
    minus3 = false;
    minus4 = false;
    minus5 = false;
    minus6 = false;

    constructor(private ref: ChangeDetectorRef,
                private route: ActivatedRoute,
                private harvestService: HarvestsService,
                private hardWorkService: HardworksService,
                private tvlService: TvlsService,
                private priceData: PriceDataService,
                public vt: ViewTypeService) {
    }

    ngOnInit(): void {
        this.loadTVLHistoryData();
        this.loadHardWorkHistoryData();
        this.loadStackedData();
    }

    loadTVLHistoryData(): void {
        forkJoin([ this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.networks[0])),
                           this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.networks[1]))
                         ]
                ).subscribe(([data, data2]) => {
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
                    setTimeout(() => {
                        this.initializeChartTotalTVL();
                        this.initializeChartUsers();
                    });
                    this.changesUsersInAmount =  this.lastChanges(this.totalUsers).amountChanges;
                    this.changesUsersInPercent =  this.lastChanges(this.totalUsers).percentChanges;
                    this.changesTvlTotalInAmount =  this.lastChanges(this.totalDataTVL).amountChanges;
                    this.changesTvlTotalInPercent =  this.lastChanges(this.totalDataTVL).percentChanges;
                    this.minus1 = this.lastChanges(this.totalDataTVL).minus;
                    this.minus3 = this.lastChanges(this.totalUsers).minus;
                }
            }, err => {
                console.log(err);
            });
    }

    loadStackedData(): void {
       this.tvlService.getHistoryTvlByVault(Addresses.ADDRESSES.get('PS'))
        .subscribe((data) => {
            const totalFarmStacked = this.prepareFarmStackedData(data, 'calculateTime');
            this.totalFarmStacked = totalFarmStacked.sort(this.sortDate);
            this.initializeChartFarmStacked();
            this.changesFarmStackedInAmount =  this.lastChanges(this.totalFarmStacked).amountChanges;
            this.changesFarmStackedInPercent =  this.lastChanges(this.totalFarmStacked).percentChanges;
            this.minus6 = this.lastChanges(this.totalFarmStacked).minus;
        }, err => {
            console.log(err);
        });
    }

    loadHardWorkHistoryData(): void {
        forkJoin([ this.hardWorkService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.networks[0]), 1),
                           this.hardWorkService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.networks[1]), 1)
                         ]
                ).subscribe(([data, data2]) => {
                if (data.length) {
                    const cumulative = new Map<string, number>();
                    const cumulative2 = new Map<string, number>();
                    let lastTotalProfit = 0;
                    let lastTotalProfit2 = 0;

                    data.forEach( hw => {
                        const date = new Date(hw.blockDate * 1000);
                        const curDate = [date.getFullYear(), date.getMonth() + 1].join('/');
                        if (!cumulative.has(curDate)) {
                            lastTotalProfit = 0;
                        }
                        lastTotalProfit += hw.fullRewardUsd;
                        cumulative.set(curDate, lastTotalProfit);
                    });

                    data2.forEach( hw => {
                        const date = new Date(hw.blockDate * 1000);
                        const curDate = [date.getFullYear(), date.getMonth() + 1].join('/');
                        if (!cumulative2.has(curDate)) {
                            lastTotalProfit = 0;
                        }
                        lastTotalProfit2 += hw.fullRewardUsd;
                        cumulative2.set(curDate, lastTotalProfit2);
                    });

                    //  let totalFarmBuyBack = this.prepareFarmBuyBack(data, 'farmBuybackSum', 'blockDate');
                    //  let totalFarmBuyBack2 = this.prepareFarmBuyBack(data2, 'farmBuybackSum', 'blockDate');
                    let totalProfit = this.prepareDataCumulative(data, cumulative, 'blockDate');
                    let totalProfit2 = this.prepareDataCumulative(data2, cumulative2, 'blockDate');
                    totalProfit = this.dataReducer(totalProfit, 50);
                    totalProfit2 = this.dataReducer(totalProfit2, 50);
                    //  totalFarmBuyBack = this.dataReducer(totalFarmBuyBack, totalFarmBuyBack.length + 1);
                    //  totalFarmBuyBack2 = this.dataReducer(totalFarmBuyBack2, totalFarmBuyBack2.length + 1);
                    //  const totalBuyBackArray = [...totalFarmBuyBack , ...totalFarmBuyBack2].sort(this.sortDate);
                    const totalProfitArray = [...totalProfit, ...totalProfit2].sort(this.sortDate);
                    const paredProfitArray = this.findNotParedDay(totalProfitArray);
                    //  const paredFarmBuyBackArray = this.findNotParedDay(totalBuyBackArray);
                    this.totalDataProfit = this.combineNetworks(paredProfitArray);
                    //  this.totalFarmBuyBack = this.combineNetworks(paredFarmBuyBackArray);
                    setTimeout(() => {
                        this.initializeChartTotalProfit();
                        //  this.initializeChartFarmBuyBack();
                    });
                    this.changesProfitTotalInAmount =  this.lastChanges(this.totalDataProfit).amountChanges;
                    this.changesProfitTotalInPercent =  this.lastChanges(this.totalDataProfit).percentChanges;
                    this.minus2 = this.lastChanges(this.totalDataProfit).minus;

                   /* this.changesFarmBuyBackInAmount = this.lastChanges(this.totalFarmBuyBack).amountChanges;
                    this.changesFarmBuyBackInPercent = this.lastChanges(this.totalFarmBuyBack).percentChanges;;
                    this.minus4 = this.lastChanges(this.totalFarmBuyBack).minus;*/

                }
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
                    this.ref.detectChanges();
                    return  ``;
                },
                backgroundColor: 'rgb(25, 27, 31)',
                borderWidth: 0,
                position: [-10, 25],
                extraCssText: 'box-shadow: none'
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
                    color: '#2c2f36'
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: [7],
                        color: '#d1d2d5',
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5',
                    }
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                  color: '#9fa3a3',
                  fontSize: '12px',
                  fontFamily: 'Inter var',
                  formatter: (value => this.selectedPeriod1 === 1 ? moment(value).format('DD.MM') : moment(value).format('MM.YY')),
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
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5',
                    }
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
                    color: '#5CADAA'
                },
                areaStyle: {
                    color: '#5CADAA',
                    opacity: 0.9
                },
            }]
        };
    }

    initializeChartTotalProfit(): void {
        let temp = '';
        this.options2 = {
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
                    const roundedSum = this.nFormatter(params.value[1], 2);
                    this.profitTotalSelectedValue = '$' + roundedSum;
                    this.profitTotalSelectedDate = date.toString();
                    this.ref.detectChanges();
                    return  ``;
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
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#d1d2d5',
                        }
                    },
                    axisLabel: {
                        color: '#9fa3a3',
                        fontSize: '14px',
                        fontFamily: 'Inter var',
                        formatter: (
                          value => this.selectedPeriod2 === 1
                            ? moment(value, 'YYYY/MM').format('DD.MM')
                            : moment(value, 'YYYY/MM').format('MM.YY')
                        ),
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
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5'
                    }
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
            }]
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
                    const roundedSum = this.nFormatter(temp, 2);
                    this.usersSelectedValue = roundedSum;
                    this.usersSelectedDate = date.toString();
                    this.ref.detectChanges();
                    return  ``;
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
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#d1d2d5',
                        }
                    },
                    axisLabel: {
                      color: '#9fa3a3',
                      fontSize: '12px',
                      fontFamily: 'Inter var',
                      formatter: (value => this.selectedPeriod3 === 1 ? moment(value).format('DD.MM') : moment(value).format('MM.YY')),
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
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5'
                    }
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
            }]
        };
    }

// TODO: check this - remove if not used
/*
    initializeChartFarmBuyBack(): void {
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
                    const roundedSum = this.nFormatter(params.value[1], 2);
                    this.farmBuyBackSelectedValue = '$' + roundedSum;
                    this.farmBuyBackSelectedDate = date.toString();
                    this.ref.detectChanges();
                    return  ``;
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
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#d1d2d5',
                        }
                    },
                    axisLabel: {
                        color: '#9fa3a3',
                        fontSize: '14px',
                        fontFamily: 'Inter var',
                        formatter: (value) => echarts.time.format('dd', value, false),
                        showMinLabel: true,
                        showMaxLabel: true,
                    },

                },
            ],
            yAxis: {
                position: 'right',
                type: 'value',
                offset: 10,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: [7],
                        color: '#d1d2d5',
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5'
                    }
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
                data: this.totalFarmBuyBack,
                itemStyle: {
                    color: '#5CADAA',
                },
            }]
        };
    }
*/

    initializeChartFarmStacked(): void {
        let temp = '';
        this.options6 = {
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
                    const roundedSum = this.nFormatter(temp, 2);
                    this.farmStackedSelectedValue = roundedSum;
                    this.farmStackedSelectedDate = date.toString();
                    this.ref.detectChanges();
                    return  ``;
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
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#d1d2d5',
                        }
                    },
                    axisLabel: {
                        color: '#9fa3a3',
                        fontSize: '14px',
                        fontFamily: 'Inter var',
                        formatter: (
                          value => this.selectedPeriod6 === 1
                            ? moment(value, 'YYYY/MM/DD').format('DD.MM')
                            : moment(value, 'YYYY/MM/DD').format('MM.YY')
                        ),
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
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#d1d2d5'
                    }
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
            }]
        };
    }

    combineNetworks(allNetworkData): ChartItem[] {
        return Object.values(allNetworkData.reduce((a, {name, value, date, sum}) => {
            a[date] = (a[date] || {name, value, date, sum: 0});
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
                const farmPrice = this.priceData.getLastFarmPrice();
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
                        date.getFullYear(), date.getMonth() + 1, date.getDate()
                    ].join('/'),
                    bb.toString()
                ],
                date: [
                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                ].join('/'),
                sum: bb
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
                    cumulative.get(curDate).toString()
                ],
                date: curDate,
                sum: cumulative.get(curDate).toString()
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
                        date.getFullYear(), date.getMonth() + 1, date.getDate()
                    ].join('/'),
                    item[valueField].toString()
                ],
                date: [
                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                ].join('/'),
                sum: item[valueField].toString()
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
                        date.getFullYear(), date.getMonth() + 1, date.getDate()
                    ].join('/'),
                    ((item.lastTvlNative / item.sharePrice) * 100).toString()
                ],
                date: [
                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                ].join('/'),
                sum: ((item.lastTvlNative / item.sharePrice) * 100).toString()
            };
        });
    }

    sortDate(a, b): number {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
    }

    findNotParedDay(totalArray): ChartItem[] {
        const paredList = [];
        const result = totalArray.reduce( (acc, o) => (acc[o.date] = (acc[o.date] || 0) + 1, acc), {} );

        for (const i of totalArray) {
            if (result[i.date] === 2) {
                paredList.push(i);
            }
        }
        return paredList;
    }

    lastChanges(data): { minus: boolean; amountChanges: string; percentChanges: string } {
        const lastChanges = +data[data.length - 1].value[1] - + data[data.length - 2].value[1];
        const previousNumber = +data[data.length - 2].value[1] ;
        let minus = false;
        let amountChanges = '';
        let percentChanges = '';
        if (lastChanges  < 0 ) {
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
            percentChanges
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
            { value: 1e18, symbol: 'e' }
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
            ))
        );
        if (tempArray.length > length) {
            return tempArray.reverse().slice(tempArray.length - length);
        } else {
            return tempArray.reverse();
        }
    }

    onChangePeriod(optionsNumber, period): void {
      this[`selectedPeriod` + optionsNumber] = period;
    }
}
