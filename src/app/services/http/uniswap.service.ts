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
        page_number: number = 1,
        page_size: number = 10,
        min_amount: number = 0,
        ordering: string = 'desc'
    ): Promise<any> {
        // eslint-disable-next-line max-len
        return fetch(`http://localhost:3000/uni?_page=${page_number}&_limit=${page_size}&_sort=amount&_order=${ordering}?amount_gte=${min_amount}`)
        .then(r => r.json())
        .then((data) => ({
                currentPage: page_number,
                nextPage: page_number + 1 > 10 ? -1 : page_number + 1,
                previousPage: page_number -1,
                totalPages: 10,
                data
            }));
    }

    getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
        return this.httpService.httpGet(`/api/transactions/history/uni?from=${minBlock}&to=${maxBlock}`);
    }

    getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
        return this.httpService.httpGet('/api/transactions/history/uni/ohcl/' + coin);
    }
}
