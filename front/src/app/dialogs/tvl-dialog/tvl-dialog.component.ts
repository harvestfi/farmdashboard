import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HarvestTvl} from '../../models/harvest-tvl';
import {createChart, IChartApi, ISeriesApi, MouseEventParams, SeriesMarker, Time} from 'lightweight-charts';
import {LightweightChartsOptions} from '../../chart/lightweight-charts-options';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TvlDialogData} from '../../dashboard/dashboard-last-values/dashboard-last-values.component';
import {ViewTypeService} from '../../services/view-type.service';
import {ChartsOptionsLight} from '../../chart/charts-options-light';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {HttpService} from '../../services/http.service';
import {HardWorkDto} from '../../models/hardwork-dto';

@Component({
  selector: 'app-tvl-dialog',
  templateUrl: './tvl-dialog.component.html',
  styleUrls: ['./tvl-dialog.component.css']
})
export class TvlDialogComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  @ViewChild('sharePriceChart') sharePriceChartEl: ElementRef;
  @ViewChild('incomeChart') incomeChartEl: ElementRef;
  chart: IChartApi;
  sharePriceChart: IChartApi;
  incomeChart: IChartApi;
  ready = false;

  pureData: HarvestTvl[];

  tvlSeries: ISeriesApi<'Line'>;
  ownersSeries: ISeriesApi<'Line'>;
  sharePriceSeries: ISeriesApi<'Line'>;
  sharePriceSeries2: ISeriesApi<'Line'>;
  priceSeries: ISeriesApi<'Line'>;
  lockedSeries: ISeriesApi<'Line'>;
  psAprSeries: ISeriesApi<'Line'>;
  amountSumUsdSeries: ISeriesApi<'Line'>;
  psTvlUsdSeries: ISeriesApi<'Line'>;

  markerAdded = [];
  markerAdded2 = [];
  markerAdded3 = [];
  markerAdded4 = [];
  markerAdded5 = [];

  tvlDataMap = new Map<number, number>();
  ownersDataMap = new Map<number, number>();
  sharePriceDataMap = new Map<number, number>();
  priceDataMap = new Map<number, number>();
  lockedDataMap = new Map<number, number>();
  psAprDataMap = new Map<number, number>();
  amountSumUsdDataMap = new Map<number, number>();
  psTvlUsdDataMap = new Map<number, number>();

  constructor(private httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: TvlDialogData,
              public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  postLoadInitCharts(): void {
    const options = LightweightChartsOptions.getOptions();
    if (this.data.type === 'income') {
      this.incomeChart = createChart(this.incomeChartEl.nativeElement, LightweightChartsOptions.getOptions());
      this.incomeChart.applyOptions(ChartsOptionsLight.getOptions());
    } else {
      this.chart = createChart(this.chartEl.nativeElement, options);
      if (this.vt.getViewType() === 'v2') {
        this.chart.applyOptions(ChartsOptionsLight.getOptions());
      }
    }
  }

  initChart(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1 && !this.sharePriceChart) {
      this.sharePriceChart = createChart(this.sharePriceChartEl.nativeElement, LightweightChartsOptions.getOptions());
      this.sharePriceChart.applyOptions(ChartsOptionsLight.getOptions());
      this.loadShareData();
    }
  }

  private loadData(): void {
    if (this.data.type === 'All') {
      this.httpService.getHistoryAllTvl().subscribe(data => {
        this.log.debug('History of All TVL loaded ', data);
        this.ready = true;
        this.cdRef.detectChanges();
        this.postLoadInitCharts();
        this.addValuesToTvlChart(data);
      });
    } else if (this.data.type === 'income') {
      this.httpService.getHardWorkHistoryData().subscribe(data => {
        this.log.debug('History of All hardworks loaded ', data);
        this.ready = true;
        this.cdRef.detectChanges();
        this.postLoadInitCharts();
        this.addValuesToHardworkChart(data);
      });
    } else {
      this.httpService.getHistoryTvlByVault(this.data.type).subscribe(data => {
        this.log.debug('History of ' + this.data.type + ' TVL loaded ', data);
        this.pureData = data;
        this.ready = true;
        this.cdRef.detectChanges();
        this.postLoadInitCharts();
        this.addValuesToTvlChart(data);
      });
    }
  }

  public addValuesToTvlChart(dtos: HarvestTvl[]): void {
    const lastTvlData = [];
    const lastOwnersData = [];
    const lastShareData = [];
    const lastPriceData = [];
    const lastLocked = [];
    const times = new Set<number>();
    dtos?.forEach(x => {
      if (times.has(x.calculateTime)) {
        return;
      }
      times.add(x.calculateTime);
      lastTvlData.push({time: x.calculateTime, value: x.lastTvl / 1000000});
      this.tvlDataMap.set(x.calculateTime, x.lastTvl / 1000000);
      lastOwnersData.push({time: x.calculateTime, value: x.lastOwnersCount});
      this.ownersDataMap.set(x.calculateTime, x.lastOwnersCount);
      if (x.sharePrice) {
        // const v = (x.sharePrice * 100) - 100;
        let v;
        if (this.data.type === 'PS') {
          v = x.sharePrice;
        } else {
          v = x.sharePrice;
        }
        lastShareData.push({time: x.calculateTime, value: v});
        this.sharePriceDataMap.set(x.calculateTime, v);
      }
      if (x.lastTvlNative && this.data.type === 'PS') {
        const v = (x.lastTvlNative / x.sharePrice) * 100;
        lastLocked.push({time: x.calculateTime, value: v});
        this.lockedDataMap.set(x.calculateTime, v);
      }
      if (x.lastPrice) {
        lastPriceData.push({time: x.calculateTime, value: x.lastPrice});
        this.priceDataMap.set(x.calculateTime, x.lastPrice);
      }
    });

    this.tvlSeries = this.chart.addLineSeries({
      title: 'TVL history M$',
      priceScaleId: 'right',
      color: '#0085ff'
    });
    this.tvlSeries.setData(lastTvlData);

    this.ownersSeries = this.chart.addLineSeries({
      title: 'Accounts',
      color: '#7e7e7e',
      priceScaleId: '1',
    });
    this.ownersSeries.setData(lastOwnersData);

    let title = 'Shared Price';
    if (this.data.type === 'PS') {
      title = 'All supply';
    }
    this.sharePriceSeries2 = this.chart.addLineSeries({
      title: title + '',
      color: '#efa4a4',
      priceScaleId: '2',
    });
    this.sharePriceSeries2.setData(lastShareData);

    this.priceSeries = this.chart.addLineSeries({
      title: 'FARM Price',
      color: '#eeb000',
      priceScaleId: '3',
    });
    this.priceSeries.setData(lastPriceData);

    this.lockedSeries = this.chart.addLineSeries({
      title: 'Staked%',
      priceFormat: {
        type: 'percent',
      },
      color: '#409b4a',
      priceScaleId: '4',
    });
    this.lockedSeries.setData(lastLocked);

    this.markerAdded = [];
    this.markerAdded2 = [];
    this.markerAdded3 = [];
    this.markerAdded4 = [];
    this.markerAdded5 = [];
    this.chart.subscribeCrosshairMove(h => {
      if (this.markerAdded.length === 0) {
        this.markerAdded.push(1);
        this.addLabelToChart(this.tvlSeries, h, this.tvlDataMap, this.markerAdded);
      }
      if (this.markerAdded2.length === 0) {
        this.markerAdded2.push(1);
        this.addLabelToChart(this.ownersSeries, h, this.ownersDataMap, this.markerAdded2);
      }

      if (this.markerAdded3.length === 0 && this.sharePriceDataMap.size !== 0) {
        this.markerAdded3.push(1);
        this.addLabelToChart(this.sharePriceSeries2, h, this.sharePriceDataMap, this.markerAdded3);
      }

      if (this.markerAdded4.length === 0 && this.priceDataMap.size !== 0) {
        this.markerAdded4.push(1);
        this.addLabelToChart(this.priceSeries, h, this.priceDataMap, this.markerAdded4);
      }
      if (this.markerAdded5.length === 0 && this.lockedDataMap.size !== 0) {
        this.markerAdded5.push(1);
        this.addLabelToChart(this.lockedSeries, h, this.lockedDataMap, this.markerAdded5);
      }
    });
    this.chart.timeScale().fitContent();
  }

  private loadShareData(): void {
    if (this.data.type === 'All') {

    } else {
      this.addValuesToShareChart(this.pureData);
    }
  }

  public addValuesToShareChart(dtos: HarvestTvl[]): void {
    const sharesData = [];
    const times = new Set<number>();
    dtos?.forEach(x => {
      if (times.has(x.calculateTime)) {
        return;
      }
      times.add(x.calculateTime);
      if (x.sharePrice) {
        // const v = (x.sharePrice * 100) - 100;
        const v = x.sharePrice;
        sharesData.push({time: x.calculateTime, value: v});
        this.sharePriceDataMap.set(x.calculateTime, v);
      }
    });
    if (sharesData.length !== 0) {
      this.sharePriceSeries = this.sharePriceChart.addLineSeries({
        title: 'Share price',
        color: '#e79494',
        priceFormat: {
          type: 'custom',
          formatter: price => price?.toFixed(5),
        },
      });
      this.sharePriceSeries.setData(sharesData);
      this.sharePriceChart.timeScale().fitContent();
      this.markerAdded = [];
      this.sharePriceChart.subscribeCrosshairMove(h => {
        if (this.markerAdded.length === 0) {
          this.markerAdded.push(1);
          this.addLabelToChart(this.sharePriceSeries, h, this.sharePriceDataMap, this.markerAdded);
        }
      });
    }
  }

  public addValuesToHardworkChart(dtos: HardWorkDto[]): void {
    const apr = [];
    const amountSumUsd = [];
    const psTvlUsd = [];
    const dates = new Set<number>();
    dtos?.forEach(x => {
      if (dates.has(x.blockDate)
        || x.blockDate < 1599609600) { // exclude crazy data
        return;
      }
      dates.add(x.blockDate);

      if (x.psApr && x.psApr !== 0) {
        apr.push({time: x.blockDate, value: x.psApr});
        this.psAprDataMap.set(x.blockDate, x.psApr);
      }

      const psAllProfit = ((x.allProfit / 0.7) * 0.3) / 1000000;
      amountSumUsd.push({time: x.blockDate, value: psAllProfit});
      this.amountSumUsdDataMap.set(x.blockDate, psAllProfit);

      psTvlUsd.push({time: x.blockDate, value: x.psTvlUsd / 1000000});
      this.psTvlUsdDataMap.set(x.blockDate, x.psTvlUsd / 1000000);
    });

    this.psAprSeries = this.incomeChart.addLineSeries({
      title: 'PS Buyback Income APR',
      color: '#0085ff',
      priceFormat: {
        type: 'percent',
      },
    });
    this.psAprSeries.setData(apr);

    this.amountSumUsdSeries = this.incomeChart.addLineSeries({
      title: 'Income USD M$',
      color: '#eeb000',
      priceScaleId: '1',
    });
    this.amountSumUsdSeries.setData(amountSumUsd);

    this.psTvlUsdSeries = this.incomeChart.addLineSeries({
      title: 'PS TVL M$',
      color: '#7e7e7e',
      priceScaleId: '2',
    });
    this.psTvlUsdSeries.setData(psTvlUsd);

    this.incomeChart.timeScale().fitContent();
    this.markerAdded = [];
    this.markerAdded2 = [];
    this.markerAdded3 = [];
    this.incomeChart.subscribeCrosshairMove(h => {
      if (this.markerAdded.length === 0) {
        this.markerAdded.push(1);
        this.addLabelToChart(this.psAprSeries, h, this.psAprDataMap, this.markerAdded);
      }

      if (this.markerAdded2.length === 0) {
        this.markerAdded2.push(1);
        this.addLabelToChart(this.amountSumUsdSeries, h, this.amountSumUsdDataMap, this.markerAdded2);
      }

      if (this.markerAdded3.length === 0) {
        this.markerAdded3.push(1);
        this.addLabelToChart(this.psTvlUsdSeries, h, this.psTvlUsdDataMap, this.markerAdded3);
      }
    });
  }

  addLabelToChart(series: ISeriesApi<'Line'>, h: MouseEventParams, map: Map<number, number>, marker: any[]): void {
    if (h && h.time && h.time !== 0) {
      if (h.seriesPrices.size !== 0) {
        const data: SeriesMarker<Time>[] = [];
        data.push({
          time: h.time,
          position: 'inBar',
          color: '#000000',
          shape: 'circle',
          size: 0,
          text: map.get(+h.time) + ''
        });
        series.setMarkers(data);
        marker.shift();
      }
    } else {
      marker.shift();
    }
  }
}
