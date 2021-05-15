import {Observable, Subscriber} from 'rxjs';
import {HarvestDto} from '../../models/harvest-dto';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {WsConsumer} from '../ws-consumer';
import {WebsocketService} from '../websocket.service';
import {SnackService} from '../snack.service';
import {Network} from '../../models/network';

@Injectable({
    providedIn: 'root'
})
export class HarvestsService implements WsConsumer {

    private $subscribers: Subscriber<HarvestDto>[] = [];
    private subscribed = false;

    constructor(private httpService: HttpService,
                private ws: WebsocketService,
                private snack: SnackService,) {
        this.ws.registerConsumer(this);
    }

    /**
     * DON'T USE! for parent class only
     */
    isSubscribed(): boolean {
        return this.subscribed;
    }

    /**
     * DON'T USE! for parent class only
     */
    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    /**
     * DON'T USE! for parent class only
     */
    subscribeToTopic(): void {
        this.ws.onMessage('/topic/harvest', (m => HarvestDto.fromJson(m.body)))?.subscribe(tx => {
            this.snack.openSnack(tx.print());
            this.$subscribers.forEach(_ => _.next(tx));
        });
    }

    /**
     * ONLY FOR DATA SERVICE
     */
    subscribeToHarvests(): Observable<HarvestDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }

    // ------------------- REST REQUESTS ---------------------

    getHarvestTxHistoryByRangeAllNetworks(minBlock: number, maxBlock: number): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/harvest?from=${minBlock}&to=${maxBlock}`);
    }

    getHarvestTxHistoryByRange(minBlock: number, maxBlock: number, network: Network): Observable<HarvestDto[]> {
        return this.httpService.httpGet(`/api/transactions/history/harvest?from=${minBlock}&to=${maxBlock}`, network);
    }

    getHarvestHistoryByVault(name: string, network: Network): Observable<HarvestDto[]> {
        return this.httpService.httpGet(`/api/transactions/history/harvest/${name}`, network);
    }

    getLastTvls(): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/last/harvest');
    }

    getAddressHistoryHarvest(address: string): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork('/history/harvest/' + address);
    }

    getHarvestTxHistoryData(): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/harvest`);
    }


}
