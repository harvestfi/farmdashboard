import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnInit {
  showChart = 'FARM';
  charts = ['FARM', 'GRAIN'];

  constructor() { }

  ngOnInit(): void {
  }

}
