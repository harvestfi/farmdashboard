import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {PriceChartBuilder} from '../price-chart-builder';
import {BarPrices, IChartApi} from 'lightweight-charts';
import {UniswapService} from '@data/services/http/uniswap.service';
import {PriceDataService} from '@data/services/data/price-data.service';
import {Addresses} from '@data/static/addresses';

@Component({
  selector: 'app-grain-chart',
  templateUrl: './grain-chart.component.html',
  styleUrls: ['./grain-chart.component.css']
})
export class GrainChartComponent implements AfterViewInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = Addresses.ADDRESSES.get('GRAIN');
  chart: IChartApi;

  /**
   * @TODO: base logic will be implemented later
   */
  @Input() base: string;

  @Output() crosshairMove = new EventEmitter<any>();

  constructor(private uniswapService: UniswapService,
              private priceData: PriceDataService,
              public vt: ViewTypeService,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    const priceChartBuilder = new PriceChartBuilder(this.log, this.coin, this.chartEl, this.vt);
    this.chart = priceChartBuilder.chart;

    this.chart.subscribeCrosshairMove(({time: timestamp, seriesPrices}) => {
      const data = seriesPrices.get(priceChartBuilder.series) as BarPrices;
      const volumeData = seriesPrices.get(priceChartBuilder.volumeSeries) as BarPrices;

      if (data && volumeData) {
        this.crosshairMove.emit({timestamp, ...data, volume: volumeData});
      }
    });

    this.uniswapService.getUniswapOHLC(this.coin).subscribe(data => {
      this.log.debug(this.coin + ' prices loaded ', data);
      priceChartBuilder.addValuesToChart(data, false);
    });

    this.priceData.subscribeToActual().subscribe(tx => {
      if (tx.tokenAddress !== this.coin) {
        return;
      }
      const volume = tx.tokenAmount;
      priceChartBuilder.collectLastTx(volume, tx.price, tx.blockDate);
    });
  }
}
