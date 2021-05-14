import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {UniswapDto} from '../../models/uniswap-dto';
import {HttpService} from './http.service';
import {OhlcDto} from '../../models/ohlc-dto';
import { Paginated } from 'src/app/models/paginated';

@Injectable({
    providedIn: 'root'
})
/**
 * @deprecated Uniswipe feed will be removed soon
 */
export class UniswapService {

    constructor(private httpService: HttpService,
                private log: NGXLogger) {
    }

    // ------------------- REST REQUESTS ---------------------

    getUniswapTxHistoryData(): Observable<UniswapDto[]> {
        return this.httpService.httpGet('/api/transactions/history/uni');
    }

    getUniswapPaginatedTxHistoryData(
        page_number: number = 0,
        page_size: number = 10,
        min_amount: number = 0,
        ordering: string = 'desc'
    ): Observable<Paginated<UniswapDto>> {
        const apiUrl = `/uni/pages?pageSize=${page_size}` +
                        `&page=${page_number}&minAmount=${min_amount}&ordering=${ordering}`;

        return this.httpService.httpGet(apiUrl);
    }

    getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
        return this.httpService.httpGet(`/api/transactions/history/uni?from=${minBlock}&to=${maxBlock}`);
    }

    getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
        return this.httpService.httpGet('/api/transactions/history/uni/ohcl/' + coin);
    }
}
