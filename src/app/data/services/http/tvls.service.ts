import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HarvestTvl} from '@data/models/harvest-tvl';
import {HttpService} from './http.service';
import {Network} from '@data/models/network';
import {StaticValues} from '@data/static/static-values';

@Injectable({
  providedIn: 'root'
})
export class TvlsService {

  constructor(private httpService: HttpService) {
  }


  getHistoryAllTvl(network: Network = StaticValues.NETWORKS.get('eth')): Observable<HarvestTvl[]> {
    return this.httpService.httpGet(`/api/transactions/history/alltvl`, network);
  }

  getHistoryTvlByVault(vault: string, network: Network = StaticValues.NETWORKS.get('eth')): Observable<HarvestTvl[]> {
    return this.httpService.httpGet(`/api/transactions/history/tvl/${vault}?reduce=10`, network);
  }

}
