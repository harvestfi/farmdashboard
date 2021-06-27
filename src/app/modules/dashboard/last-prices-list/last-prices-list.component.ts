import {Component} from '@angular/core';
import {PriceDataService} from '@data/services/data/price-data.service';
import {PricesDto} from '@data/models/prices-dto';

@Component({
  selector: 'app-last-prices-list',
  templateUrl: './last-prices-list.component.html',
  styleUrls: ['./last-prices-list.component.css']
})
export class LastPricesListComponent {

  constructor(private pricesData: PriceDataService) {
  }

  getAllPrices(): PricesDto[] {
    return this.pricesData.getAllPrices();
  }

  getPrice(priceDto: PricesDto): number {
    return this.pricesData.getUsdPrice(priceDto.tokenAddress, priceDto.network);
  }

}
