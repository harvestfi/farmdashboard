import { Injectable } from '@angular/core';
import { UniswapService } from '../http/uniswap.service';
import { NGXLogger } from 'ngx-logger';
import { UniswapDto } from '@data/models/uniswap-dto';
import { Utils } from '@data/static/utils';
import { PricesService } from '../http/prices.service';
import { PricesDto } from '@data/models/prices-dto';
import { Addresses } from '@data/static/addresses';
import { PriceDataService } from './price-data.service';
import { SnackBarService } from '@shared/snack-bar/snack-bar.service';
import { BancorService } from '@data/services/http/bancor.service';
import { BancorDto } from '@data/models/bancor-dto';

@Injectable({
  providedIn: 'root'
})
export class UniswapDataService {
  farmTrades: UniswapDto[] = [];
  lastFarmUni: UniswapDto;
  lastBancor: BancorDto;
  txIds = new Set<string>();

  constructor(private uniswapService: UniswapService,
			  private bancorService: BancorService,
              private pricesService: PricesService,
              private priceData: PriceDataService,
              private snack: SnackBarService,
              private log: NGXLogger) {
    this.load();
  }

  private load(): void {
    this.uniswapService.getUniswapTxHistoryData().subscribe(unis => {
          this.log.debug('Last 100 uniswaps loaded', unis);
          return unis?.sort((a, b) => a.block > b.block ? 1 : -1)
          ?.forEach(this.handleFarmTradeUni.bind(this));
        }
    );

    this.pricesService.subscribeToPrices().subscribe(() => {
        setTimeout(() => {
            const bancor =  BancorDto.fromJson("{\"id\":\"0xe5571a4a7de06bd9aa357713be03f3db1ae06da014ddbbcd63ba4c1173129\",\"logid\":68,\"block\":13586929,\"blockDate\":1637324493,\"amountFarm\":3.652603049302888,\"amountBnt\":131.10055312827768,\"priceBtn\":4.66788,\"priceFarm\":3.652603049302888,\"farmAsSource\":3.652603049302888,\"tokenAddress\":\"0xa0246c9032bc3a600820415ae600c6388619a14d\"}");
            console.log(bancor);
            this.handleFarmTradeUni(bancor);

        }, 5000);
        this.handlePriceToUni.bind(this);
  });

    ///this.bancorService.subscribeToBancor().subscribe(this.handlePriceToUni.bind(this));
  }

  private handleFarmTradeUni(uniDto: UniswapDto): void {
    if (!uniDto
        || uniDto?.coinAddress !== Addresses.ADDRESSES.get('FARM')
        || uniDto?.type === 'REM'
        || uniDto?.type === 'ADD'
    ) {
      // this.log.warn('Not FARM uni dto', uniDto);
      return;
    }
    if (this.isNotActual(uniDto)) {
      this.log.warn('Not actual uni', uniDto, this.lastFarmUni);
      return;
    }
    if (!this.isUniqTx(uniDto)) {
      this.log.warn('Not unique uni dto', uniDto);
      return;
    }
    UniswapDto.round(uniDto);
    this.lastFarmUni = uniDto;
    Utils.addInArrayAtTheStart(this.farmTrades, uniDto);
    // this.log.info('uni', uniDto);
    this.snack.openSnack(Object.assign(new UniswapDto(), uniDto)?.print());
  }

  private handlePriceToUni(priceDto: PricesDto): void {
    const price = priceDto.price * this.priceData.getUsdPrice(priceDto.otherTokenAddress, priceDto.network);
    const uniDto = priceDto.toUniswap();
    uniDto.lastPrice = price;
    this.handleFarmTradeUni(uniDto);
  }

  private isNotActual(dto: UniswapDto): boolean {
    return !!this.lastFarmUni && (!dto || this.lastFarmUni.blockDate > dto.blockDate);
  }

  private isUniqTx(tx: UniswapDto): boolean {
    if (this.txIds.has(tx.id)) {
      return false;
    }
    this.txIds.add(tx.id);
    if (this.txIds.size > 100_000) {
      this.txIds = new Set<string>();
    }
    return true;
  }
}
