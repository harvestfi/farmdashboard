import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Observable, Subscriber} from 'rxjs';
import {WsConsumer} from '../ws-consumer';
import {UniswapDto} from '../../models/uniswap-dto';
import {HttpService} from './http.service';
import {WebsocketService} from '../websocket.service';
import {OhlcDto} from '../../models/ohlc-dto';

@Injectable({
    providedIn: 'root'
})
export class UniswapService implements WsConsumer {
    subscribed = false;
    private $subscribers: Subscriber<UniswapDto>[] = [];

    constructor(private httpService: HttpService,
                private ws: WebsocketService, private log: NGXLogger) {
        if (this.ws.registerConsumer(this) && !this.subscribed) {
            this.subscribeToTopic();
        }
    }

    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    isSubscribed(): boolean {
        return this.subscribed;
    }

    subscribeToTopic(): void {
        this.ws.onMessage('/topic/transactions', (m => UniswapDto.fromJson(m.body)))
            ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
    }

    subscribeToUniswapEvents(): Observable<UniswapDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }

    getUniswapTxHistoryData(): Observable<UniswapDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/uni');
    }

    getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/uni?from=${minBlock}&to=${maxBlock}`);
    }

    getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/uni/ohcl/' + coin);
    }
}
