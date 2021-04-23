import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {PricesService} from '../http/prices.service';
import {PricesDto} from '../../models/prices-dto';
import {StaticValues} from '../../static/static-values';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/internal/Observable';
import {flatMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PriceDataService {
  private pureTitle = 'Harvest Live Dashboard';
  private lastFarmPrice: number;
  private prices: Map<string, Map<string, PricesDto>> = new Map(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );
  private dataFeed: Observable<PricesDto>;

  constructor(
      private pricesService: PricesService,
      private titleService: Title,
      private log: NGXLogger
  ) {
    this.load();
  }

  private load(): void {
    this.pricesService.getLastPrices().subscribe(prices => {
      this.log.info('Load last prices', prices);
      prices.forEach(this.handlePrice.bind(this));
    });
    this.dataFeed = this.pricesService.subscribeToPrices()
    .pipe(
        flatMap(price => this.handlePrice(price))
    );
  }

  private handlePrice(price: PricesDto): Observable<PricesDto> {
    const lastPrice = this.prices.get(price.network).get(price.token);
    if (lastPrice && lastPrice.block > price.block) {
      this.log.warn('Price DTO older on ' + (lastPrice.block - price.block), lastPrice, price);
      return new Observable<PricesDto>();
    }
    this.prices.get(price.network).set(price.token, price);
    if (price.token === 'FARM' && price.otherToken === 'ETH') {
      this.lastFarmPrice = price.price * this.getUsdPrice('ETH', 'eth');
      this.log.info('FARM price updated', this.lastFarmPrice);
      this.titleService.setTitle(this.lastFarmPrice + ' | ' + this.pureTitle);
    }
    // this.dataFeed;
    return new Observable<PricesDto>(o => o.next(price));
  }

  public getAllPrices(): string[] {
    const result = [];
    this.prices.forEach((prs, network) =>
        prs.forEach((price, name) =>
            result.push(network + '&' + name)
        )
    );
    return result;
  }

  public getPriceDto(name: string, network: string): PricesDto {
    return this.prices.get(network).get(name);
  }

  public getUsdPrice(name: string, network: string): number {
    if (StaticValues.isStableCoin(name)) {
      return 1;
    }
    const targetPriceDto = this.prices.get(network)?.get(name);
    if (!targetPriceDto) {
      return 0;
    }
    let price = targetPriceDto.price;
    if (!StaticValues.isStableCoin(targetPriceDto.otherToken)) {
      const otherTokenUsdPrice = this.getUsdPrice(targetPriceDto.otherToken, network);
      price *= otherTokenUsdPrice;
    }
    return price;
  }

  public getLastFarmPrice(): number {
    return this.lastFarmPrice || 0;
  }

  public subscribeToActual(): Observable<PricesDto> {
    return this.dataFeed;
  }
}
