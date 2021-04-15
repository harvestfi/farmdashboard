import {Observable, Subscriber} from 'rxjs';
import {HarvestDto} from '../../models/harvest-dto';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {WsConsumer} from '../ws-consumer';
import {WebsocketService} from '../websocket.service';

@Injectable({
    providedIn: 'root'
})
export class HarvestsService implements WsConsumer {

    private $subscribers: Subscriber<HarvestDto>[] = [];
    private subscribed = false;

    constructor(private httpService: HttpService,
                private ws: WebsocketService) {
        this.ws.registerConsumer(this);
        this.setSubscribed(true);
    }

    isSubscribed(): boolean {
        return this.subscribed;
    }

    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    subscribeToTopic(): void {
        this.ws.onMessage('/topic/harvest', (m => HarvestDto.fromJson(m.body)))?.subscribe(tx => {
            this.$subscribers.forEach(_ => _.next(tx));
        });
    }

    subscribeToHarvests(): Observable<HarvestDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }

    getHarvestTxHistoryByRange(minBlock: number, maxBlock: number): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/harvest?from=${minBlock}&to=${maxBlock}`);
    }

    getHarvestHistoryByVault(name: string): Observable<HarvestDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/harvest/${name}`);
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
