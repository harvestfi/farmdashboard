import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import {EChartsOption} from 'echarts/types/src/export/option';
import {chartData} from './mokData/charts.data';
import {ChartSeries} from '@modules/dashboard/vault-stats/models/chart-series.model';
import {ActivatedRoute} from '@angular/router';
import {HarvestDto} from '@data/models/harvest-dto';
import {HarvestsService} from '@data/services/http/harvests.service';
import {StaticValues} from '@data/static/static-values';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {HardworksService} from '@data/services/http/hardworks.service';
import {TvlsService} from '@data/services/http/tvls.service';
import {HarvestTvl} from '@data/models/harvest-tvl';
import {ViewTypeService} from '@data/services/view-type.service';
import {RewardsService} from '@data/services/http/rewards.service';
import {RewardDto} from '@data/models/reward-dto';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';

@Component({
  selector: 'app-vault-stats',
  templateUrl: './vault-stats.component.html',
  styleUrls: ['./vault-stats.component.scss']
})
export class VaultStatsComponent implements OnInit {

    options1: EChartsOption;
    options2: EChartsOption;
    options3: EChartsOption;
    options4: EChartsOption;


    title1 = 'TVL';
    title2 = 'Profits';
    title3 = 'APY';
    title4 = 'Users';

    tvlSelectedValue = '';
    tvlSelectedDate = '';
    profitSelectedValue = '';
    profitSelectedDate = '';
    usersSelectedValue = '';
    usersSelectedDate = '';
    apySelectedValue = '';
    apySelectedDate = '';

    valueSymbol1 = '$';
    valueSymbol2 = '$';
    valueSymbol3 = '%';
    valueSymbol4 = '';

    changesVolumeInPercent = '';
    changesVolumeInAmount = '';
    changesTvlInPercent = '';
    changesTvlInAmount = '';
    changesUsersInAmount = '';
    changesUsersInPercent = '';
    changesAPYInAmount = '';
    changesAPYInPercent = '';

    minus1 = false;
    minus2 = false;
    minus3 = false;
    minus4 = false;

    vaultAddress = '';
    vaultNetwork = '';

    vaultDataTVL: ChartSeries[] = [];
    vaultDataProfit: ChartSeries[] = [];
    vaultDataUsers: ChartSeries[] = [];
    vaultDataAPY: ChartSeries[] = [];

    gasSaved = '$' + this.nFormatter(0, 2);


    constructor(private ref: ChangeDetectorRef,
                private route: ActivatedRoute,
                private harvestService: HarvestsService,
                private hardWorkService: HardworksService,
                private tvlService: TvlsService,
                private rewardsService: RewardsService,
                private hardworkData: HardworkDataService,
                public vt: ViewTypeService) {
        route.params.subscribe(routeVal => {
          if (routeVal) {
              this.vaultAddress = routeVal.address;
              this.vaultNetwork = routeVal.network;
          }
        });
    }

    ngOnInit(): void {
        this.loadSingleVaultTVL();
        this.loadSingleVaultProfit();
        this.loadSingleVaultAPY();
        this.loadSingleVaultUsers();
    }

    hardWork(): HardWorkDto {
        return this.hardworkData.getLastHardWork(this.vaultAddress, this.vaultNetwork);
    }

    get vaultEarned(): number {
        return this.hardWork()?.fullRewardUsdTotal * (1 - this.hardWork()?.profitSharingRate);
    }

    loadSingleVaultTVL(): void {
        this.harvestService.getHarvestHistoryByVault(this.vaultAddress, StaticValues.NETWORKS.get(this.vaultNetwork))
            .subscribe((data: HarvestDto[]) => {
                if (data.length) {
                    this.vaultDataTVL = data.map((item) => {
                        const date = new Date(item.blockDate * 1000);
                        return {
                            name: date.toUTCString(),
                            value: [
                                [
                                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                                ].join('/'),
                                item.lastUsdTvl.toString()
                            ]
                        };
                    });
                    this.vaultDataTVL = this.dataReducer(this.vaultDataTVL, 20);
                    this.initializeChartTVL();
                    this.changesTvlInAmount =  this.lastChanges(this.vaultDataTVL).amountChanges;
                    this.changesTvlInPercent =  this.lastChanges(this.vaultDataTVL).percentChanges;
                    this.minus1 = this.lastChanges(this.vaultDataTVL).minus;
                }
            }, err => {
                console.log(err);
            });
    }
    initializeChartTVL(): void {
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
                    this.tvlSelectedValue = '$' + roundedSum;
                    this.tvlSelectedDate = date.toString();
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
                right: '6%',
                bottom: '12%',
            },
            axisPointer: {
                lineStyle: {
                    type: 'solid',
                    color: '#2c2f36'
                }
            },
            xAxis: {
                type: 'category',
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
                    fontSize: '14px',
                    fontFamily: 'Inter var',
                    formatter: (value) => echarts.format.formatTime('dd', value, false),
                    showMinLabel: true,
                    showMaxLabel: true,
                },
                boundaryGap: false,

            },
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
                data: this.vaultDataTVL,
                itemStyle: {
                    color: '#EAF6F6'
                },
                areaStyle: {
                    color: '#5CADAA',
                    opacity: 0.9
                },
            }]
        };
    }

    loadSingleVaultProfit(): void {
        this.hardWorkService.getHardWorkHistoryDataByAddress(this.vaultAddress, StaticValues.NETWORKS.get(this.vaultNetwork))
            .subscribe((data) => {
                if (data.length) {
                    this.vaultDataProfit = data.map((item: HardWorkDto) => {
                        const date = new Date(item.blockDate * 1000);
                        return {
                            name: date.toUTCString(),
                            value: [
                                [
                                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                                ].join('/'),
                                item.fullRewardUsd.toString()
                            ]
                        };
                    });
                    this.vaultDataProfit  = this.dataReducer(this.vaultDataProfit, 100);
                    this.gasSaved = '$' + this.nFormatter(data[data.length - 1].savedGasFeesSum, 2);
                    this.initializeChartProfit();
                    this.changesVolumeInAmount =  this.lastChanges(this.vaultDataProfit).amountChanges;
                    this.changesVolumeInPercent =  this.lastChanges(this.vaultDataProfit).percentChanges;
                    this.minus2 = this.lastChanges(this.vaultDataProfit).minus;
                }
            }, err => {
                console.log(err);
            });
    }
    initializeChartProfit(): void {
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
                    this.profitSelectedValue = '$' + roundedSum;
                    this.profitSelectedDate = date.toString();
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
                right: '6%',
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
                        formatter: (value) => echarts.format.formatTime('MM', value, false),
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
                barWidth: '90%',
                data: this.vaultDataProfit,
                itemStyle: {
                    color: '#5CADAA',
                },
            }]
        };
    }

    loadSingleVaultAPY(): void {
        this.rewardsService.getHistoryRewards(this.vaultAddress, StaticValues.NETWORKS.get(this.vaultNetwork))
            .subscribe((data) => {
                if (data.length) {
                    this.vaultDataAPY = data.map((item: RewardDto) => {
                        const date = new Date(item.blockDate * 1000);
                        return {
                            name: date.toUTCString(),
                            value: [
                                [
                                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                                ].join('/'),
                                item.weeklyApy.toString()
                            ]
                        };
                    });

                    this.vaultDataAPY  = this.dataReducer(this.vaultDataAPY, 100);
                    this.initializeChartAPY();
                    this.changesAPYInAmount =  this.lastChanges(this.vaultDataAPY).amountChanges;
                    this.changesAPYInPercent =  this.lastChanges(this.vaultDataAPY).percentChanges;
                    this.minus3 = this.lastChanges(this.vaultDataAPY).minus;
                }
            }, err => {
                console.log(err);
            });
    }
    initializeChartAPY(): void {
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
                    let roundedSum = this.nFormatter(temp, 2);
                    if (+temp < 1) {
                       const tempNumber = +temp;
                       roundedSum = tempNumber.toFixed(2);
                    }
                    this.apySelectedValue = roundedSum + '%';
                    this.apySelectedDate = date.toString();
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
                right: '6%',
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
                        formatter: (value) => echarts.format.formatTime('MM', value, false),
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
                barWidth: '90%',
                data: this.vaultDataAPY,
                itemStyle: {
                    color: '#5CADAA',
                },
            }]
        };
    }

    loadSingleVaultUsers(): void {
        this.tvlService.getHistoryTvlByVault(this.vaultAddress, StaticValues.NETWORKS.get(this.vaultNetwork))
            .subscribe((data) => {
                if (data.length) {
                    this.vaultDataUsers = data.map((item: HarvestTvl) => {
                        const date = new Date(item.calculateTime * 1000);
                        return {
                            name: date.toUTCString(),
                            value: [
                                [
                                    date.getFullYear(), date.getMonth() + 1, date.getDate()
                                ].join('/'),
                                item.lastOwnersCount.toString()
                            ]
                        };
                    });

                    this.vaultDataUsers  = this.dataReducer(this.vaultDataUsers, 100);
                    this.initializeChartUsers();
                    this.changesUsersInAmount =  this.lastChanges(this.vaultDataUsers).amountChanges;
                    this.changesUsersInPercent =  this.lastChanges(this.vaultDataUsers).percentChanges;
                    this.minus4 = this.lastChanges(this.vaultDataUsers).minus;
                }
            }, err => {
                console.log(err);
            });
    }
    initializeChartUsers(): void {
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
                right: '6%',
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
                        formatter: (value) => echarts.format.formatTime('dd', value, false),
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
                data: this.vaultDataUsers,
                itemStyle: {
                    color: '#5CADAA',
                },
            }]
        };
    }


    lastChanges(data): { minus: boolean; amountChanges: string; percentChanges: string } {
        const lastChanges = +data[data.length - 1].value[1] - + data[data.length - 2].value[1];
        const previousNumber = +data[data.length - 2].value[1];
        let minus = false;
        let amountChanges = '';
        let percentChanges = '';
        if (lastChanges  < 0 ) {
            minus = true;
        }
        if (minus) {
            amountChanges =  Math.abs(lastChanges) >= 1  ? this.nFormatter(lastChanges * (-1), 2) : (lastChanges * (-1)).toFixed(2) ;
        } else {
            amountChanges =  Math.abs(lastChanges) >= 1 ? this.nFormatter(lastChanges, 2) : lastChanges.toFixed(2) ;
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
            { value: 1e6, symbol: 'm' },
            { value: 1e9, symbol: 'b' },
            { value: 1e12, symbol: 't' },
            { value: 1e15, symbol: 'p' },
            { value: 1e18, symbol: 'e' }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup.slice().reverse().find((it) => num >= it.value);
        return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0.00';
    }

    dataReducer(data, length): Array<{name: string; value: Array<string>}> {
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

}
