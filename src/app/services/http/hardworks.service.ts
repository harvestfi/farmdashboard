import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {HardWorkDto} from '../../models/hardwork-dto';
import {HttpService} from './http.service';
import {WsConsumer} from "../ws-consumer";
import {WebsocketService} from "../websocket.service";

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class HardworksService implements WsConsumer {
    private subscribed = false;
    private $subscribers: Subscriber<HardWorkDto>[] = [];

    constructor(private httpService: HttpService, private ws: WebsocketService) {
    }

    getHardWorkHistoryData(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/hardwork');
    }

    getHardWorkHistoryDataByName(name: string): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/hardwork/${name}`);
    }

    getLastHardWorks(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/last/hardwork');
    }

    getPaginatedHardworkHistoryData(
        page_size: number = 10,
        page_number: number = 0,
        vault?: string,
        minAmount: number = 0,
        ordering: string = 'desc'):
        Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(
            `/hardwork/pages` +
            `?pageSize=${page_size}`
            + `&page=${page_number}`
            + `${vault ? `&vault=${vault}` : ''}`
            + `&minAmount=${minAmount}`
            + `&ordering=${ordering}`);
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
        })
    }
}
