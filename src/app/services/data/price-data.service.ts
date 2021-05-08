import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {PricesService} from '../http/prices.service';
import {PricesDto} from '../../models/prices-dto';
import {StaticValues} from '../../static/static-values';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/internal/Observable';
import {flatMap} from 'rxjs/operators';
import {Addresses} from '../../static/addresses';

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
      // load last farm again for avoid errors with otherToken price calculation
      this.pricesService.getLastPrice(StaticValues.FARM_ADDRESS, StaticValues.NETWORKS.get('eth'))
      .subscribe(p => this.handlePrice(p));
    });

    this.dataFeed = this.pricesService.subscribeToPrices()
    .pipe(
        flatMap(price => this.handlePrice(price))
    );
  }

  private handlePrice(price: PricesDto): Observable<PricesDto> {
    if (!price) {
      return new Observable<PricesDto>();
    }
    const lastPrice = this.prices.get(price?.network)?.get(price?.tokenAddress.toLowerCase());
    if (lastPrice && lastPrice.block > price.block) {
      this.log.warn('Price DTO older on ' + (lastPrice.block - price.block), lastPrice, price);
      return new Observable<PricesDto>();
    }
    this.prices.get(price.network).set(price.tokenAddress.toLowerCase(), price);
    if (price.token === 'FARM' && price.otherToken === 'ETH') {
      const ethPrice = this.getUsdPrice(Addresses.ADDRESSES.get('WETH'), 'eth');
      this.lastFarmPrice = price.price * ethPrice;
      this.log.info('FARM price updated', this.lastFarmPrice, price.price, ethPrice);
      this.titleService.setTitle(this.lastFarmPrice?.toFixed(2) + ' | ' + this.pureTitle);
    }
    // this.dataFeed;
    return new Observable<PricesDto>(o => o.next(price));
  }

  public getAllPrices(): PricesDto[] {
    const result = [];
    this.prices.forEach((prs, network) =>
        prs.forEach((price, name) =>
            result.push(price)
        )
    );
    return result;
  }

  public getPriceDto(address: string, network: string): PricesDto {
    return this.prices.get(network).get(address.toLowerCase());
  }

  public getUsdPrice(address: string, network: string): number {
    if (StaticValues.isStableCoin(address)) {
      return 1;
    }
    const targetPriceDto = this.prices.get(network)?.get(address.toLowerCase());
    if (!targetPriceDto) {
      return 0;
    }
    const otherTokenPrice = this.getUsdPrice(targetPriceDto.otherTokenAddress.toLowerCase(), network);
    const price = targetPriceDto.price * otherTokenPrice;
    if (price === Infinity) {
      return 0;
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
