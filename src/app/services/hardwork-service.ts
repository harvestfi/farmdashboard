import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HardWorkDto} from '../models/hardwork-dto';
import {catchError} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {SnackService} from './snack.service';
import {Network} from "../models/network";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private apiEndpoint: string;
    private url = '/api/transactions';

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
        this.apiEndpoint = config.apiEndpoint;
        console.log('apiEndpoint is: ' + this.apiEndpoint);
    }

    getHardWorkHistoryData(network: Network): Observable<HardWorkDto[]> {
        return this.http.get<HardWorkDto[]>(this.apiEndpoint + `${this.url}/history/hardwork`).pipe(
            catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history`))
        );
    }

    getHWHistoryDataByRange(network: Network, minBlock: number, maxBlock: number): Observable<HardWorkDto[]> {
        return this.http.get<HardWorkDto[]>(this.apiEndpoint + `${this.url}/history/hardwork?from=${minBlock}&to=${maxBlock}`).pipe(
            catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history`))
        );
    }

    getHardWorkHistoryDataByName(network: Network, name: string): Observable<HardWorkDto[]> {
        return this.http.get<HardWorkDto[]>(this.apiEndpoint + `${this.url}/history/hardwork/` + name).pipe(
            catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history for ` + name))
        );
    }


    getLastHardWorks(network: Network): Observable<HardWorkDto[]> {
        return this.http.get<HardWorkDto[]>(this.apiEndpoint + `${this.url}/last/hardwork`).pipe(
            catchError(this.snackService.handleError<HardWorkDto[]>(`last HardWork `))
        );
    }


}
