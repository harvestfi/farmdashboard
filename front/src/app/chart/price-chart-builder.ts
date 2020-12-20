import {UniswapDto} from '../models/uniswap-dto';
import {OhlcDto} from '../models/ohlc-dto';
import {ElementRef, ViewChild} from '@angular/core';
import {createChart, IChartApi} from 'lightweight-charts';
import {NGXLogger} from 'ngx-logger';
import {LightweightChartsOptions} from './lightweight-charts-options';
import {ViewTypeService} from '../services/view-type.service';

export class PriceChartBuilder {
  lastDate = 0;
  lastUpdatedPrice = 0.0;
  lastOhlc: OhlcDto;
  candleTime = 60 * 60; // sec
  chart: IChartApi;
  series;
  coin;

  constructor(private log: NGXLogger, coin: string, chartEl: ElementRef, public vt: ViewTypeService) {
    this.coin = coin;

    this.chart = createChart(chartEl.nativeElement, LightweightChartsOptions.getOptions());

    if (this.vt.getViewType() === 'v2') {
      this.chart.applyOptions({
        // height: 400,
        layout: {
          backgroundColor: '#fffce6',
          textColor: 'rgba(0,0,0,0.9)',
        },
        watermark: {
          color: 'rgba(0,0,0,0.7)',
          text: coin + ' price chart'
        },
        grid: {
          vertLines: {
            color: 'rgb(169,168,168)',
          },
          horzLines: {
            color: 'rgb(169,168,168)',
          },
        },
        leftPriceScale: {
          borderColor: 'rgb(169,168,168)',
          // visible: true,
        },
        rightPriceScale: {
          borderColor: 'rgb(169,168,168)',
        },
        timeScale: {
          borderColor: 'rgb(169,168,168)',
        }
      });
    } else {
      this.chart.applyOptions({
        // rightPriceScale: {
        //   autoScale: true
        // },
        height: 500,
        timeScale: {
          rightOffset: 10,
          // fixLeftEdge: true,
        }
      });
    }
  }

  public collectLastUniTx(uniDto: UniswapDto): void {
    if (!this.lastDate) {
      this.log.debug('First data price not collected');
      return;
    }
    const dtoDate = uniDto?.blockDate;
    const dtoPrice = uniDto?.lastPrice;
    if (dtoPrice !== this.lastUpdatedPrice) {
      this.lastUpdatedPrice = dtoPrice;
    } else {
      return;
    }

    const dto = new OhlcDto();
    if (dtoDate - this.lastOhlc.timestamp > this.candleTime) { // new candle
      dto.timestamp = Math.round(dtoDate / this.candleTime) * this.candleTime;
      dto.open = dtoPrice;
      dto.high = dtoPrice;
      dto.low = dtoPrice;
      dto.close = dtoPrice;
    } else {
      dto.timestamp = this.lastOhlc.timestamp;
      dto.open = this.lastOhlc.open;
      if (dtoPrice > this.lastOhlc.high) {
        dto.high = dtoPrice;
      } else {
        dto.high = this.lastOhlc.high;
      }
      if (dtoPrice < this.lastOhlc.low) {
        dto.low = dtoPrice;
      } else {
        dto.low = this.lastOhlc.low;
      }
      dto.close = dtoPrice;
    }
    const dtos: OhlcDto[] = [dto];
    this.addValuesToChart(dtos, true);
  }

  public addValuesToChart(dtos: OhlcDto[], update: boolean): void {
    if (!this.chart) {
      this.log.error('Chart not yet init');
    }
    const data = [];
    dtos?.forEach(dto => {
      if (dto.timestamp > this.lastDate) {
        this.lastDate = dto.timestamp;
      }
      this.lastOhlc = dto;
      data.push({time: dto.timestamp, open: dto.open, high: dto.high, low: dto.low, close: dto.close});
    });
    if (!this.series) {
      this.series = this.chart.addCandlestickSeries();
    }
    if (update) {
      const tick = data[0];
      this.series.update(tick);
    } else {
      this.series.setData(data);
    }

  }
}
