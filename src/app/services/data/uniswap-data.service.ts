import {Injectable} from '@angular/core';
import {UniswapService} from '../http/uniswap.service';
import {NGXLogger} from 'ngx-logger';
import {UniswapDto} from '../../models/uniswap-dto';
import {Utils} from '../../static/utils';
import {PricesService} from '../http/prices.service';
import {PricesDto} from '../../models/prices-dto';
import {Addresses} from '../../static/addresses';
import {PriceDataService} from './price-data.service';
import {SnackService} from '../snack.service';

@Injectable({
  providedIn: 'root'
})
export class UniswapDataService {
  farmTrades: UniswapDto[] = [];
  lastFarmUni: UniswapDto;
  txIds = new Set<string>();

  constructor(private uniswapService: UniswapService,
              private pricesService: PricesService,
              private priceData: PriceDataService,
              private snack: SnackService,
              private log: NGXLogger) {
    this.load();
  }

  private load() {
    this.uniswapService.getUniswapTxHistoryData().subscribe(unis => {
          this.log.debug('Last 100 uniswaps loaded', unis);
          return unis?.sort((a, b) => a.block > b.block ? 1 : -1)
          ?.forEach(this.handleFarmTradeUni.bind(this));
        }
    );

    this.pricesService.subscribeToPrices().subscribe(this.handlePriceToUni.bind(this));
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
