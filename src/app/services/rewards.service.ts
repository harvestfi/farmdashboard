import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {SnackService} from './snack.service';
import {RewardDto} from '../models/reward-dto';

export class RewardsService {

    private url = '/api/transactions';
    private apiEndpoint;

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
        this.apiEndpoint = config.apiEndpoint;
        console.log('apiEndpoint is: ' + this.apiEndpoint);
    }

    getLastRewards(): Observable<RewardDto[]> {
        return this.http.get<RewardDto[]>(this.apiEndpoint + '/api/transactions/last/reward').pipe(
            catchError(this.snackService.handleError<RewardDto[]>(`last reward `))
        );
    }

    getHistoryRewards(name: string): Observable<RewardDto[]> {
        return this.http.get<RewardDto[]>(this.apiEndpoint + '/api/transactions/history/reward/' + name).pipe(
            catchError(this.snackService.handleError<RewardDto[]>(`history reward `))
        );
    }

    getAllHistoryRewards(startTimestamp?: number, endTimestamp?: number): Observable<RewardDto[]> {
        startTimestamp = Math.floor(startTimestamp || (new Date(0).getTime() / 1000));
        endTimestamp = Math.floor(endTimestamp || (Date.now() / 1000));
        return this.http.get<RewardDto[]>(
            `${this.apiEndpoint}/api/transactions/history/reward/?start=${startTimestamp}&end=${endTimestamp}`)
            .pipe(
                catchError(this.snackService.handleError<RewardDto[]>(`history reward `))
            );
    }

}
