import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {PriceChartBuilder} from '../price-chart-builder';
import {IChartApi} from 'lightweight-charts';
import {UniswapService} from '../../services/http/uniswap.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Addresses} from '../../static/addresses';

@Component({
  selector: 'app-grain-chart',
  templateUrl: './grain-chart.component.html',
  styleUrls: ['./grain-chart.component.css']
})
export class GrainChartComponent implements AfterViewInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = Addresses.ADDRESSES.get('GRAIN');
  chart: IChartApi;

  constructor(private uniswapService: UniswapService,
              private priceData: PriceDataService,
              public vt: ViewTypeService,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    const priceChartBuilder = new PriceChartBuilder(this.log, this.coin, this.chartEl, this.vt);
    this.uniswapService.getUniswapOHLC(this.coin).subscribe(data => {
      this.log.debug(this.coin + ' prices loaded ', data);
      priceChartBuilder.addValuesToChart(data, false);
    });

    this.priceData.subscribeToActual().subscribe(tx => {
      if (tx.tokenAddress !== this.coin) {
        return;
      }
      priceChartBuilder.collectLastTx(tx.price, tx.blockDate);
    });
  }
}
