import {Observable} from 'rxjs';
import {HarvestDto} from '../../models/harvest-dto';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class HarvestsService {

    constructor(private httpService: HttpService) {
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
