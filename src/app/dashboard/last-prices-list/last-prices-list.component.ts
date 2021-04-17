import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PricesDto} from '../../models/prices-dto';
import {PricesService} from '../../services/http/prices.service';

@Component({
  selector: 'app-last-prices-list',
  templateUrl: './last-prices-list.component.html',
  styleUrls: ['./last-prices-list.component.css']
})
export class LastPricesListComponent implements OnInit {

  private prices: Map<string, PricesDto> = new Map();
  private counter = 0; // counter to figure out when to refresh the view
  constructor(private pricesService: PricesService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.pricesService.getLastPrices().subscribe(prices => {
      prices.forEach(this.handlePrice.bind(this));
    });
    this.pricesService.subscribeToPrices().subscribe(this.handlePrice.bind(this));
  }

  /**
   * Update the price map if a new price has come in,
   * otherwise if the price is actually an older price
   * ignore it.
   * Maintain a counter so we only update every 10 or so
   * price changes, so we're not constantly updating items.
   *
   * @param price
   */
  private handlePrice(price: PricesDto) {
    const lastPrice = this.prices.get(price.token);
    if(lastPrice && lastPrice.block > price.block) {return;}
    this.prices.set(price.token, price);
    this.counter++;
    if(this.counter > 10){
      this.counter = this.counter%10;
      this.cdRef.detectChanges();
    }
  }

  /**
   * Do an array copy here to avoid having to
   * use price.values() in the UI.
   */
  getPrices() {
    return this.prices;
  }

}
