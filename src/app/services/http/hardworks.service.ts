import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HardWorkDto} from '../../models/hardwork-dto';
import {Network} from '../../models/network';
import {StaticValues} from '../../static/static-values';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class HardworksService {

    constructor(private httpService: HttpService) {
    }

    getHardWorkHistoryData(network: Network = StaticValues.NETWORK_ETH): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/api/transactions/history/hardwork', network);
    }

    getHardWorkHistoryDataByName(name: string, network: Network = StaticValues.NETWORK_ETH): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(`/api/transactions/history/hardwork/${name}`, network);
    }

    getLastHardWorks(network: Network = StaticValues.NETWORK_ETH): Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork('/last/hardwork', network);
    }

    getPaginatedHardworkHistoryData(
        page_size: number = 10,
        page_number: number = 0,
        vault?: string,
        minAmount: number = 0,
        ordering: string = 'desc',
        network: Network = StaticValues.NETWORK_ETH,):
        Observable<HardWorkDto[]> {
        return this.httpService.httpGetWithNetwork(
            `/hardwork/pages` +
            `?pageSize=${page_size}`
            + `&page=${page_number}`
            + `${vault ? `&vault=${vault}` : ''}`
            + `&minAmount=${minAmount}`
            + `&ordering=${ordering}`,
            network);
    }



}
