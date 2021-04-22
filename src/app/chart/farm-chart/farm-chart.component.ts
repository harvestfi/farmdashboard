import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {UniswapSubscriberService} from '../../flow-cards/uniswap/uniswap-subscriber.service';
import {ViewTypeService} from '../../services/view-type.service';
import {PriceChartBuilder} from '../price-chart-builder';
import {IChartApi} from 'lightweight-charts';
import {UniswapService} from '../../services/http/uniswap.service';
import {ChartsOptionsLight} from '../charts-options-light';


@Component({
  selector: 'app-farm-chart',
  templateUrl: './farm-chart.component.html',
  styleUrls: ['./farm-chart.component.css']
})
export class FarmChartComponent implements AfterViewInit, OnInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = 'FARM';
  otherCoin = 'ETH';
  chart: IChartApi;

  constructor(private uniswapService: UniswapService,
              private uniswapSubscriberService: UniswapSubscriberService,
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

  ngAfterViewInit(): void {
    const priceChartBuilder = new PriceChartBuilder(this.log, this.coin, this.chartEl, this.vt);
    this.chart = priceChartBuilder.chart;
    this.uniswapService.getUniswapOHLC(this.coin).subscribe(data => {
      this.log.debug(this.coin + ' prices loaded ', data);
      priceChartBuilder.addValuesToChart(data, false);
    });

    this.uniswapSubscriberService.handlers.set(this, tx => {
      if (tx.coin !== this.coin || tx.otherCoin !== this.otherCoin) {
        return;
      }
      priceChartBuilder.collectLastUniTx(tx);
    });
  }

  @HostListener('window:resize', ['$event'])
  handleScreenResize($event: any): void {
    this.chart?.resize(this.chartEl?.nativeElement?.clientWidth,
        this.chartEl?.nativeElement?.clientHeight);
  }
}
