import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '@data/services/view-type.service';
import {PriceChartBuilder} from '../price-chart-builder';
import {BarPrices, IChartApi} from 'lightweight-charts';
import {UniswapService} from '@data/services/http/uniswap.service';
import {ChartsOptionsLight} from '../charts-options-light';
import {PriceDataService} from '@data/services/data/price-data.service';
import {Addresses} from '@data/static/addresses';
import { DestroyService } from '@data/services/destroy.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-farm-chart',
  templateUrl: './farm-chart.component.html',
  styleUrls: ['./farm-chart.component.css'],
  providers: [DestroyService],
})
export class FarmChartComponent implements AfterViewInit, OnInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = Addresses.ADDRESSES.get('FARM');
  otherCoin = Addresses.ADDRESSES.get('WETH');
  chart: IChartApi;

  /**
   * @TODO: base logic will be implemented later
   */
  @Input() base: string;

  @Output() crosshairMove = new EventEmitter<any>();

  constructor(
    private uniswapService: UniswapService,
    private priceData: PriceDataService,
    public vt: ViewTypeService,
    public cdRef: ChangeDetectorRef,
    private log: NGXLogger,
    private destroy$: DestroyService,
  ) {
  }

  ngOnInit(): void {
    this.vt.events$
      .pipe(
        filter(event => event === 'theme-changed'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
      });
  }

  @HostListener('window:resize', ['$event'])
  handleScreenResize($event: any): void {
    this.chart?.resize(this.chartEl?.nativeElement?.clientWidth,
        this.chartEl?.nativeElement?.clientHeight);
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

    this.uniswapService.getUniswapOHLC(this.coin)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.log.debug(this.coin + ' prices loaded ', data);
        priceChartBuilder.addValuesToChart(data, false);
      });

    this.priceData.subscribeToActual()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tx => {
        if (tx.tokenAddress !== this.coin || tx.otherTokenAddress !== this.otherCoin) {
          return;
        }
        const price = tx.price * this.priceData.getUsdPrice(tx.otherTokenAddress, tx.network);
        const volume = tx.tokenAmount;
        priceChartBuilder.collectLastTx(volume, price, tx.blockDate);
      });
  }
}
