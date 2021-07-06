import {Component, OnInit} from '@angular/core';
import { OhlcDto } from '@data/models/ohlc-dto';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss']
})
export class PriceChartComponent implements OnInit {
  showChart = 'FARM';
  charts = ['FARM', 'GRAIN'];
  selectedData = null;

  selectedBase = 'USDC';
  bases = ['USDC'];

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  updateSelectedData(data: OhlcDto): void {
    this.selectedData = data;
  }
}
