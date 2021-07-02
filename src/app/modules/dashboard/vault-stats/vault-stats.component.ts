import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import {EChartsOption} from 'echarts/types/src/export/option';
import {chartData} from './mokData/charts.data';
import {ChartSeries} from '@modules/dashboard/vault-stats/models/chart-series.model';

@Component({
  selector: 'app-vault-stats',
  templateUrl: './vault-stats.component.html',
  styleUrls: ['./vault-stats.component.css']
})
export class VaultStatsComponent implements OnInit {

    options1: EChartsOption;
    options2: EChartsOption;

    data1: ChartSeries[] = [];
    data2: ChartSeries[] = [];
    title1 = 'TVL';
    title2 = 'Profits to Farmers';
    chartName1 = '[ETH/BSC]';
    chartName2 = '[ETH/BSC]';
    tvlSelectedValue = '';
    tvlSelectedDate = '';
    profitSelectedValue = '';
    profitSelectedDate = '';
    valueSymbol1 = '$';
    valueSymbol2 = '$';
    changesVolumeInPercent = '';
    changesVolumeInAmount = '';
    changesTvlInPercent = '';
    changesTvlInAmount = '';
    minus1 = false;
    minus2 = false;


    constructor(private ref: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fillChartsDataSets();
        this.initializeCharts();
        this.lastChangesInit();
    }

    fillChartsDataSets(): void {
        chartData.map((item) => {
            const date = new Date(item.date * 1000);
            this.data1.push({
                name: date.toUTCString(),
                value: [
                    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'),
                    item.tvlUSD
                ]
            });
            this.data2.push({
                name: date.toUTCString(),
                value: [
                    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'),
                    item.volumeUSD
                ]
            });
            return item;
        });

    }
    initializeCharts(): void {
        let temp = '';
        let temp2 = '';
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
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: 'rgb(108, 114, 132)',
                    fontSize: '16px',
                    fontFamily: 'Inter var',
                    formatter: (value) => echarts.format.formatTime('dd', value, false),
                    showMinLabel: true,
                    showMaxLabel: true,
                    interval: 3,
                },
                boundaryGap: false,

            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                show: false
            },
            series: [{
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: this.data1,
                itemStyle: {
                    color: '#ff007a'
                },
                areaStyle: {
                    color: '#37162a'
                },
            }]
        };
        this.options2 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                formatter: (params) => {
                    params = params[0];
                    if (params.value[1] !== temp2) {
                        temp2 = params.value[1];
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
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: 'rgb(108, 114, 132)',
                        fontSize: '16px',
                        fontFamily: 'Inter var',
                        formatter: (value) => echarts.format.formatTime('dd', value, false),
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 3,
                    },

                },
            ],
            yAxis: [{
                show: false,
                type: 'value'
            }],
            series: [{
                type: 'bar',
                barWidth: '70%',
                data: this.data2,
                itemStyle: {
                    color: '#2172e5',
                    borderRadius: 6
                },
            }]
        };
    }
    lastChangesInit(): void {
        const lastChangesVolume = +chartData[chartData.length - 1].volumeUSD - +chartData[chartData.length - 2].volumeUSD;
        const previousNumberVolume = +chartData[chartData.length - 2].volumeUSD;

        if (lastChangesVolume  < 0 ) {
            this.minus1 = true;
        }
        if (this.minus1) {
            this.changesVolumeInAmount = this.nFormatter(lastChangesVolume * (-1), 2);
        } else {
            this.changesVolumeInAmount = this.nFormatter(lastChangesVolume, 2);
        }
        const finalVolumePercent = Math.abs(lastChangesVolume  / previousNumberVolume * 100);
        if (finalVolumePercent >= 1) {
            this.changesVolumeInPercent = this.nFormatter(finalVolumePercent.toString(), 2);
        } else {
            this.changesVolumeInPercent = finalVolumePercent.toFixed(2);
        }


        const lastChangesTvl = +chartData[chartData.length - 1].tvlUSD - +chartData[chartData.length - 2].tvlUSD;
        const previousNumberTvl = +chartData[chartData.length - 2].tvlUSD;
        if (lastChangesTvl  < 0 ) {
            this.minus2 = true;
        }
        if (this.minus2) {
            this.changesTvlInAmount = this.nFormatter(lastChangesTvl * (-1), 2);
        } else {
            this.changesTvlInAmount = this.nFormatter(lastChangesTvl, 2);
        }
        const finalTvlPercent = Math.abs(lastChangesTvl / previousNumberTvl * 100);
        if (finalTvlPercent >= 1) {
            this.changesTvlInPercent = this.nFormatter(finalTvlPercent.toString(), 2);
        } else {
            this.changesTvlInPercent = finalTvlPercent.toFixed(2);
        }
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
}
