import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '../../services/view-type.service';
import {PriceChartBuilder} from '../price-chart-builder';
import {IChartApi} from 'lightweight-charts';
import {UniswapService} from '../../services/http/uniswap.service';
import {ChartsOptionsLight} from '../charts-options-light';
import {PriceDataService} from '../../services/data/price-data.service';
import {Addresses} from '../../static/addresses';


@Component({
  selector: 'app-farm-chart',
  templateUrl: './farm-chart.component.html',
  styleUrls: ['./farm-chart.component.css']
})
export class FarmChartComponent implements AfterViewInit, OnInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = Addresses.ADDRESSES.get('FARM');
  otherCoin = Addresses.ADDRESSES.get('WETH');
  chart: IChartApi;

  constructor(private uniswapService: UniswapService,
              private priceData: PriceDataService,
              public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
    this.vt.events$.subscribe(event => {
      if (event === 'theme-changed') {
        this.chart.applyOptions(ChartsOptionsLight.getOptions(this.vt.getThemeColor()));
      }
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
    this.uniswapService.getUniswapOHLC(this.coin).subscribe(data => {
      this.log.debug(this.coin + ' prices loaded ', data);
      priceChartBuilder.addValuesToChart(data, false);
    });

    this.priceData.subscribeToActual().subscribe(tx => {
      if (tx.tokenAddress !== this.coin || tx.otherTokenAddress !== this.otherCoin) {
        return;
      }
      const price = tx.price * this.priceData.getUsdPrice(tx.otherTokenAddress, tx.network);
      const volume = tx.tokenAmount;
      priceChartBuilder.collectLastTx(volume, price, tx.blockDate);
    });
  }
}
