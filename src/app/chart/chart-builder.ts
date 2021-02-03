import {ElementRef} from '@angular/core';
import {createChart, IChartApi, ISeriesApi, MouseEventParams, SeriesMarker, Time} from 'lightweight-charts';
import {LightweightChartsOptions} from './lightweight-charts-options';
import {ChartsOptionsLight} from './charts-options-light';

export class ChartBuilder {
  chartData = [[]];
  series: ISeriesApi<'Line'>[] = [];
  dataMaps: Map<number, number>[] = [];
  markers = [];
  priceLineVisible = true;

  public initVariables(dataCount: number): void {
    this.dataMaps = [];
    this.chartData = [];
    for (let i = 0; i < dataCount; i++) {
      this.dataMaps.push(new Map<number, number>());
      this.chartData.push([]);
      this.markers.push(0);
    }

  }

  initChart(chartEl: ElementRef, options?): IChartApi {
    let enrichOptions = false;
    if (!options) {
      enrichOptions = true;
      options = LightweightChartsOptions.getOptions();
    }
    const chart = createChart(chartEl?.nativeElement, options);
    if (enrichOptions) {
      chart.applyOptions(ChartsOptionsLight.getOptions());
    }
    return chart;
  }

  public addToChart(chart: IChartApi, config: string[][]): void {
    for (let i = 0; i < config.length; i++) {
      this.createSeries(i, config, chart);

      chart.subscribeCrosshairMove(h => {
        if (this.markers[i] === 0) {
          this.markers[i] = 1;
          this.addLabelToChart(h, i);
        }
      });
    }
    chart.timeScale().fitContent();
  }

  public addInData(i: number, timestamp: number, v: number): void {
    if (!v || v === 0 || !timestamp || timestamp === 0 || this.dataMaps[i].get(timestamp)) {
      return;
    }
    this.chartData[i].push({time: timestamp, value: v});
    this.dataMaps[i].set(timestamp, v);
  }

  private createSeries(i: number, config: string[][], chart: IChartApi): void {
    this.series[i] = chart.addLineSeries({
      title: config[i][0],
      priceScaleId: config[i][1],
      color: config[i][2],
      priceLineVisible: false
    });
    this.series[i].setData(this.chartData[i]);
  }

  private addLabelToChart(h: MouseEventParams, i: number): void {
    if (h && h.time && h.time !== 0) {
      if (h.seriesPrices.size !== 0) {
        const data: SeriesMarker<Time>[] = [];
        data.push({
          time: h.time,
          position: 'inBar',
          color: '#000000',
          shape: 'circle',
          size: 0,
          text: this.dataMaps[i].get(+h.time)?.toFixed(2)
        });
        this.series[i].setMarkers(data);
        this.markers[i] = 0;
      }
    } else {
      this.markers[i] = 0;
    }
  }

}
