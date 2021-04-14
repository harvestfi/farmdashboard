import {Observable} from 'rxjs';
import {HarvestDto} from '../../models/harvest-dto';
import {catchError} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {HttpClient} from '@angular/common/http';
import {SnackService} from '../snack.service';
import {HarvestTvl} from '../../models/harvest-tvl';
import {Network} from '../../models/network';
import {StaticValues} from '../../static/static-values';

@Injectable({
    providedIn: 'root'
})
export class TvlsService {

    private url = '/api/transactions';
    private apiEndpoint;

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
        this.apiEndpoint = config.apiEndpoint;
        console.log('apiEndpoint is: ' + this.apiEndpoint);
    }


    getHistoryAllTvl(network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestTvl[]> {
        return this.http.get<HarvestTvl[]>(this.apiEndpoint + `${this.url}/history/alltvl`).pipe(
            catchError(this.snackService.handleError<HarvestTvl[]>(`history all TVL`))
        );
    }

    getHistoryTvlByVault(vault: string, network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestTvl[]> {
        return this.http.get<HarvestTvl[]>(this.apiEndpoint + `${this.url}/history/tvl/${vault}`).pipe(
            catchError(this.snackService.handleError<HarvestTvl[]>(`history TVL ` + vault))
        );
    }

}
