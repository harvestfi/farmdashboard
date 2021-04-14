import {Observable} from 'rxjs';
import {HarvestDto} from '../../models/harvest-dto';
import {catchError} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {HttpClient} from '@angular/common/http';
import {SnackService} from '../snack.service';
import {Network} from '../../models/network';
import {StaticValues} from '../../static/static-values';

@Injectable({
    providedIn: 'root'
})
export class HarvestsService {

    private url = '/api/transactions';
    private apiEndpoint;

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: HttpClient, private snackService: SnackService) {
        this.apiEndpoint = config.apiEndpoint;
        console.log('apiEndpoint is: ' + this.apiEndpoint);
    }

    getHarvestTxHistoryByRange(minBlock: number, maxBlock: number, network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestDto[]> {
        return this.http.get<HarvestDto[]>(this.apiEndpoint + `${this.url}/history/harvest?from=${minBlock}&to=${maxBlock}`).pipe(
            catchError(this.snackService.handleError<HarvestDto[]>(`Harvest history`))
        );
    }

    getHarvestHistoryByVault(name: string, network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestDto[]> {
        return this.http.get<HarvestDto[]>(this.apiEndpoint + `${this.url}/history/harvest/` + name).pipe(
            catchError(this.snackService.handleError<HarvestDto[]>(name + `Harvest history`))
        );
    }

    getLastTvls(network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestDto[]> {
        return this.http.get<HarvestDto[]>(this.apiEndpoint + '/api/transactions/last/harvest').pipe(
            catchError(this.snackService.handleError<HarvestDto[]>(`last TVL `))
        );
    }

    getAddressHistoryHarvest(address: string, network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestDto[]> {
        return this.http.get<HarvestDto[]>(this.apiEndpoint + '/history/harvest/' + address).pipe(
            catchError(this.snackService.handleError<HarvestDto[]>(`history address harvest `))
        );
    }

    getHarvestTxHistoryData(network: Network  = StaticValues.NETWORK_ETH): Observable<HarvestDto[]> {
        return this.http.get<HarvestDto[]>(this.apiEndpoint + `${this.url}/history/harvest`).pipe(
            catchError(this.snackService.handleError<HarvestDto[]>(`Harvest history`))
        );
    }


}
