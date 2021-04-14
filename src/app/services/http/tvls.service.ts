import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HarvestTvl} from '../../models/harvest-tvl';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class TvlsService {

    constructor(private httpService: HttpService) {
    }


    getHistoryAllTvl(): Observable<HarvestTvl[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/alltvl`);
    }

    getHistoryTvlByVault(vault: string): Observable<HarvestTvl[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/tvl/${vault}`);
    }

}
