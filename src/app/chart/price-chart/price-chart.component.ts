import { Component, OnInit } from '@angular/core';
import { ViewTypeService } from 'src/app/services/view-type.service';
@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnInit {
  showChart = 'FARM';
  charts = ['FARM', 'GRAIN'];

  constructor(public vt: ViewTypeService) { }

  ngOnInit(): void {
  }

}
