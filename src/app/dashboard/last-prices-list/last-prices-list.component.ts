import { Component, OnInit } from '@angular/core';
import { LastPrice } from 'src/app/models/last-price';
import { PricesCalculationService } from 'src/app/services/prices-calculation.service';

@Component({
  selector: 'app-last-prices-list',
  templateUrl: './last-prices-list.component.html',
  styleUrls: ['./last-prices-list.component.css']
})
export class LastPricesListComponent implements OnInit {

  constructor(private pricesCalculationService: PricesCalculationService) { }

  ngOnInit(): void {
  }

  get allPrices(): LastPrice[] {
    return this.pricesCalculationService.allPrices;
  }

}
