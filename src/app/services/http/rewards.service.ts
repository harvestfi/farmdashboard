import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {RewardDto} from '../../models/reward-dto';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class RewardsService {

    constructor(private httpService: HttpService) {
    }

    getLastRewards(): Observable<RewardDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/last/reward');
    }

    getHistoryRewards(name: string): Observable<RewardDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/reward/' + name);
    }

    getAllHistoryRewards(startTimestamp?: number, endTimestamp?: number): Observable<RewardDto[]> {
        startTimestamp = Math.floor(startTimestamp || (new Date(0).getTime() / 1000));
        endTimestamp = Math.floor(endTimestamp || (Date.now() / 1000));
        return this.httpService.httpGetWithNetwork(
            `/api/transactions/history/reward/?start=${startTimestamp}&end=${endTimestamp}`);
    }

}
