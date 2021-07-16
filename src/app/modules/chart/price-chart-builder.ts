import {OhlcDto} from '@data/models/ohlc-dto';
import {ElementRef} from '@angular/core';
import {createChart, IChartApi} from 'lightweight-charts';
import {NGXLogger} from 'ngx-logger';
import {LightweightChartsOptions} from './lightweight-charts-options';
import {ViewTypeService} from '@data/services/view-type.service';
import {ChartsOptionsLight} from './charts-options-light';

export class PriceChartBuilder {
  lastDate = 0;
  lastUpdatedPrice = 0.0;
  lastUpdatedVolume = 0.0;
  lastOhlc: OhlcDto;
  candleTime = 60 * 60; // sec
  chart: IChartApi;
  series;
  volumeSeries;
  coin;

  constructor(private log: NGXLogger, coin: string, chartEl: ElementRef, public vt: ViewTypeService) {
    this.coin = coin;
    this.chart = createChart(chartEl.nativeElement, LightweightChartsOptions.getOptions());
    this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
  }

  public collectLastTx(volume: number, price: number, blockDate: number): void {
    if (!this.lastDate) {
      this.log.debug('First data price not collected');
      return;
    }
    if (price !== this.lastUpdatedPrice && volume !== this.lastUpdatedVolume) {
      this.lastUpdatedPrice = price;
      this.lastUpdatedVolume = volume;
    } else {
      return;
    }
    const dto = new OhlcDto();
    if (blockDate - this.lastOhlc.timestamp > this.candleTime) { // new candle
      dto.timestamp = Math.round(blockDate / this.candleTime) * this.candleTime;
      dto.open = price;
      dto.high = price;
      dto.low = price;
      dto.close = price;
      dto.volume = volume;
    } else {
      // If old candle, we need to add the new vol. to the old volume.
      dto.volume = volume + this.lastOhlc.volume;
      dto.timestamp = this.lastOhlc.timestamp;
      dto.open = this.lastOhlc.open;
      if (price > this.lastOhlc.high) {
        dto.high = price;
      } else {
        dto.high = this.lastOhlc.high;
      }
      if (price < this.lastOhlc.low) {
        dto.low = price;
      } else {
        dto.low = this.lastOhlc.low;
      }
      dto.close = price;
    }
    const dtos: OhlcDto[] = [dto];
    this.addValuesToChart(dtos, true);
  }

  public addValuesToChart(dtos: OhlcDto[], update: boolean): void {
    if (!this.chart) {
      this.log.error('Chart not yet init');
    }
    const data = [];
    const volumeData = [];
    dtos?.forEach(dto => {
      if (dto.timestamp > this.lastDate) {
        this.lastDate = dto.timestamp;
      }
      this.lastOhlc = dto;
      volumeData.push({time: dto.timestamp, value: dto.volume});
      data.push({time: dto.timestamp, open: dto.open, high: dto.high, low: dto.low, close: dto.close});
    });
    if (!this.volumeSeries){
      this.volumeSeries = this.chart.addHistogramSeries({
        color: 'rgba(0,94,255,0.21)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });
  }
    if (!this.series) {
      this.series = this.chart.addCandlestickSeries();
    }
    if (update) {
      const tick = data[0];
      const volTick = volumeData[0];
      this.series.update(tick);
      this.volumeSeries.update(volTick);
    } else {
      this.series.setData(data);
      this.volumeSeries.setData(volumeData);
    }

  }
}
