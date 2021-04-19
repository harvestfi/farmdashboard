import {Inject, Injectable} from '@angular/core';
import {forkJoin, Observable, Subscriber} from 'rxjs';
import {HardWorkDto} from '../../models/hardwork-dto';
import {HttpService} from './http.service';
import {WsConsumer} from '../ws-consumer';
import {WebsocketService} from '../websocket.service';
import {Paginated} from '../../models/paginated';
import {StaticValues} from '../../static/static-values';
import {Network} from '../../models/network';
import {map} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../../app.config';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class HardworksService implements WsConsumer {
    private subscribed = false;
    private $subscribers: Subscriber<HardWorkDto>[] = [];

    constructor(
        @Inject(APP_CONFIG) public config: AppConfig,
        private httpService: HttpService,
        private ws: WebsocketService) {
    }

    getHardWorkHistoryData(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/hardwork');
    }

    getHardWorkHistoryDataByName(name: string): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/hardwork/${name}`);
    }

    getAllLastHardWorks(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/last/hardwork');
    }

    getPaginatedHardworkHistoryData(
        page_size: number = 10,
        page_number: number = 0,
        vault?: string,
        minAmount: number = 0,
        ordering: string = 'desc',
        network: Network = StaticValues.NETWORKS.get('eth')):
        Observable<Paginated<HardWorkDto>> {
        const urlAtr = `/hardwork/pages` +
            `?pageSize=${page_size}`
            + `&page=${page_number}`
            + `${vault ? `&vault=${vault}` : ''}`
            + `&minAmount=${minAmount}`
            + `&ordering=${ordering}`;
        if (this.config.multipleSources) {
            return this.httpService.httpGet(urlAtr, network);
        } else {
            return this.httpService.httpGetWithNetwork(urlAtr);
        }
    }

    getLastHardWorks(size: number): Observable<HardWorkDto[]> {
        if (this.config.multipleSources) {
            return forkJoin([
                this.getPaginatedHardworkHistoryData(
                    size, 0, '', 0, 'desc', StaticValues.NETWORKS.get('eth')),
                this.getPaginatedHardworkHistoryData(
                    size, 0, '', 0, 'desc', StaticValues.NETWORKS.get('bsc'))
            ]).pipe(
                map(restResponses => restResponses.map(resp => resp?.data)),
                map(x => x.flat())
            );
        } else {
            return this.getPaginatedHardworkHistoryData(size, 0, '', 0, 'desc')
            .pipe(
                map(el => el?.data)
            );
        }
    }

    isSubscribed(): boolean {
        return this.subscribed;
    }

    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    public initWs(): void {
        if (this.ws.registerConsumer(this) && !this.subscribed) {
            this.subscribeToTopic();
            this.subscribed = true;
        }
    }

    public subscribeToTopic(): void {
        this.ws.onMessage('/topic/hardwork', (m => HardWorkDto.fromJson(m.body)))
        ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
    }

    public subscribeToHardworks(): Observable<HardWorkDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }
}