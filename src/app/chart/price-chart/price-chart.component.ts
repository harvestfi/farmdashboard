import {Component, OnInit} from '@angular/core';
import { OhlcDto } from 'src/app/models/ohlc-dto';
import {ViewTypeService} from 'src/app/services/view-type.service';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss']
})
export class PriceChartComponent implements OnInit {
  showChart = 'FARM';
  charts = ['FARM', 'GRAIN'];
  selectedData = null;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  updateSelectedData(data: OhlcDto): void {
    this.selectedData = data;
  }
}
