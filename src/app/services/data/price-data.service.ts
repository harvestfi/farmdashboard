import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {PricesService} from '../http/prices.service';
import {PricesDto} from '../../models/prices-dto';
import {StaticValues} from '../../static/static-values';

@Injectable({
  providedIn: 'root'
})
export class PriceDataService {

  private prices: Map<string, Map<string, PricesDto>> = new Map(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );

  constructor(
      private pricesService: PricesService,
      private log: NGXLogger
  ) {
    this.load();
  }

  private load(): void {
    this.pricesService.getLastPrices().subscribe(prices => {
      this.log.info('Load last prices', prices);
      prices.forEach(this.handlePrice.bind(this));
    });
    this.pricesService.subscribeToPrices().subscribe(this.handlePrice.bind(this));
  }

  private handlePrice(price: PricesDto) {
    const lastPrice = this.prices.get(price.network).get(price.token);
    if (lastPrice && lastPrice.block > price.block) {
      return;
    }
    this.prices.get(price.network).set(price.token, price);
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
}
