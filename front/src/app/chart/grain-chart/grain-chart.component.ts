import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../../dashboard/dashboard-last-values/dashboard-last-values.component';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../chart-builder';
import {PriceService} from '../../services/price.service';
import {OhlcDto} from '../../models/ohlc-dto';
import {createChart, IChartApi} from 'lightweight-charts';
import {UniswapSubscriberService} from '../../uniswap/uniswap-subscriber.service';
import {LightweightChartsOptions} from '../lightweight-charts-options';
import {UniswapDto} from '../../models/uniswap-dto';
import {PriceChartBuilder} from '../price-chart-builder';

@Component({
  selector: 'app-grain-chart',
  templateUrl: './grain-chart.component.html',
  styleUrls: ['./grain-chart.component.css']
})
export class GrainChartComponent implements AfterViewInit {
  @ViewChild('price_chart') chartEl: ElementRef;
  coin = 'GRAIN';

  constructor(private priceService: PriceService,
              private uniswapSubscriberService: UniswapSubscriberService,
              public vt: ViewTypeService,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    const priceChartBuilder = new PriceChartBuilder(this.log, this.coin, this.chartEl, this.vt);
    this.priceService.getUniswapOHLC(this.coin).subscribe(data => {
      this.log.debug(this.coin + ' prices loaded ', data);
      priceChartBuilder.addValuesToChart(data, false);
    });

    this.uniswapSubscriberService.handlers.set(this, tx => {
      if (tx.coin !== this.coin) {
        return;
      }
      priceChartBuilder.collectLastUniTx(tx);
    });
  }
}
