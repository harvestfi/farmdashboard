import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HardWorkDto} from '../../models/hardwork-dto';
import {HttpService} from './http.service';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {RestResponse} from '../../models/rest-response';
import {Paginated} from '../../models/paginated';

@Injectable({
    providedIn: 'root'
})
export class HardworksService {

    constructor(private httpService: HttpService) {
    }

    getHardWorkHistoryData(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/hardwork');
    }

    getHardWorkHistoryDataByName(name: string): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/hardwork/${name}`);
    }

    getLastHardWorks(): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/last/hardwork');
    }

    getPaginatedHardworkHistoryData(
        page_size: number = 10,
        page_number: number = 0,
        vault?: string,
        minAmount: number = 0,
        ordering: string = 'desc'):
        Observable<RestResponse<Paginated<HardWorkDto>>> {
        return this.httpService.httpGetWithNetwork(
            `/hardwork/pages` +
            `?pageSize=${page_size}`
            + `&page=${page_number}`
            + `${vault ? `&vault=${vault}` : ''}`
            + `&minAmount=${minAmount}`
            + `&ordering=${ordering}`);
    }



}
