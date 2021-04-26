import {Component} from '@angular/core';
import {PriceDataService} from '../../services/data/price-data.service';

@Component({
  selector: 'app-last-prices-list',
  templateUrl: './last-prices-list.component.html',
  styleUrls: ['./last-prices-list.component.css']
})
export class LastPricesListComponent {

  constructor(private pricesData: PriceDataService) {
  }

  getAllPrices() {
    return this.pricesData.getAllPrices();
  }

  fullNameToName(fName: string): string {
    return fName.split('&')[1];
  }

  getPrice(fName: string): number {
    const tmp = fName.split('&');
    return this.pricesData.getUsdPrice(tmp[1], tmp[0]);
  }

}
