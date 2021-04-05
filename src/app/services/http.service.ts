import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SnackService} from './snack.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UniswapDto} from '../models/uniswap-dto';
import {HarvestDto} from '../models/harvest-dto';
import {HarvestTvl} from '../models/harvest-tvl';
import {HardWorkDto} from '../models/hardwork-dto';
import {RewardDto} from '../models/reward-dto';
import {environment} from '../../environments/environment';
import {TransferDto} from '../models/transfer-dto';
import {OhlcDto} from '../models/ohlc-dto';
import {PricesDto} from '../models/prices-dto';
import {Balance} from '../models/balance';
import {ContractVault} from '../models/contract-valut';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = '/api/transactions';

  constructor(private http: HttpClient, private snackService: SnackService) {
  }

  getUniswapTxHistoryData(): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(environment.apiEndpoint + `${this.url}/history/uni`).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`Uni history`))
    );
  }

  getUniswapTxHistoryByRange(minBlock: number, maxBlock: number): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(environment.apiEndpoint + `${this.url}/history/uni?from=${minBlock}&to=${maxBlock}`).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`Uni history`))
    );
  }

  getHarvestTxHistoryData(): Observable<HarvestDto[]> {
    return this.http.get<HarvestDto[]>(environment.apiEndpoint + `${this.url}/history/harvest`).pipe(
        catchError(this.snackService.handleError<HarvestDto[]>(`Harvest history`))
    );
  }

  getHarvestTxHistoryByRange(minBlock: number, maxBlock: number): Observable<HarvestDto[]> {
    return this.http.get<HarvestDto[]>(environment.apiEndpoint + `${this.url}/history/harvest?from=${minBlock}&to=${maxBlock}`).pipe(
        catchError(this.snackService.handleError<HarvestDto[]>(`Harvest history`))
    );
  }

  getHarvestHistoryByVault(name: string): Observable<HarvestDto[]> {
    return this.http.get<HarvestDto[]>(environment.apiEndpoint + `${this.url}/history/harvest/` + name).pipe(
        catchError(this.snackService.handleError<HarvestDto[]>(name + `Harvest history`))
    );
  }


  getHardWorkHistoryData(): Observable<HardWorkDto[]> {
    return this.http.get<HardWorkDto[]>(environment.apiEndpoint + `${this.url}/history/hardwork`).pipe(
        catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history`))
    );
  }

  getPaginatedHardworkHistoryData(page_size: number = 10, page_number: number = 0): Observable<HardWorkDto[]> {
    return this.http.get<HardWorkDto[]>(`${environment.apiEndpoint}/history/pages?pageSize=${page_size}?page${page_number}`).pipe(
      catchError(this.snackService.handleError<HardWorkDto[]>('Hardwork paginated history')
    ))
  }  

  getHWHistoryDataByRange(minBlock: number, maxBlock: number): Observable<HardWorkDto[]> {
    return this.http.get<HardWorkDto[]>(environment.apiEndpoint + `${this.url}/history/hardwork?from=${minBlock}&to=${maxBlock}`).pipe(
        catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history`))
    );
  }

  getHardWorkHistoryDataByName(name: string): Observable<HardWorkDto[]> {
    return this.http.get<HardWorkDto[]>(environment.apiEndpoint + `${this.url}/history/hardwork/` + name).pipe(
        catchError(this.snackService.handleError<HardWorkDto[]>(`HardWork history for ` + name))
    );
  }

  getLastTvls(): Observable<HarvestDto[]> {
    return this.http.get<HarvestDto[]>(environment.apiEndpoint + '/api/transactions/last/harvest').pipe(
        catchError(this.snackService.handleError<HarvestDto[]>(`last TVL `))
    );
  }

  getHistoryAllTvl(): Observable<HarvestTvl[]> {
    return this.http.get<HarvestTvl[]>(environment.apiEndpoint + '/api/transactions/history/alltvl').pipe(
        catchError(this.snackService.handleError<HarvestTvl[]>(`history all TVL`))
    );
  }

  getHistoryTvlByVault(vault: string): Observable<HarvestTvl[]> {
    return this.http.get<HarvestTvl[]>(environment.apiEndpoint + '/api/transactions/history/tvl/' + vault).pipe(
        catchError(this.snackService.handleError<HarvestTvl[]>(`history TVL ` + vault))
    );
  }

  getLastHardWorks(): Observable<HardWorkDto[]> {
    return this.http.get<HardWorkDto[]>(environment.apiEndpoint + '/api/transactions/last/hardwork').pipe(
        catchError(this.snackService.handleError<HardWorkDto[]>(`last HardWork `))
    );
  }

  getLastRewards(): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(environment.apiEndpoint + '/api/transactions/last/reward').pipe(
        catchError(this.snackService.handleError<RewardDto[]>(`last reward `))
    );
  }

  getHistoryRewards(name: string): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(environment.apiEndpoint + '/api/transactions/history/reward/' + name).pipe(
        catchError(this.snackService.handleError<RewardDto[]>(`history reward `))
    );
  }

  getAllHistoryRewards(startTimestamp?: number, endTimestamp?: number): Observable<RewardDto[]> {
    startTimestamp = Math.floor(startTimestamp || (new Date(0).getTime() / 1000));
    endTimestamp = Math.floor(endTimestamp || (Date.now() / 1000));
    return this.http.get<RewardDto[]>(
        `${environment.apiEndpoint}/api/transactions/history/reward/?start=${startTimestamp}&end=${endTimestamp}`)
    .pipe(
        catchError(this.snackService.handleError<RewardDto[]>(`history reward `))
    );
  }

  getAddressHistoryHarvest(address: string): Observable<HarvestDto[]> {
    return this.http.get<HarvestDto[]>(environment.apiEndpoint + '/history/harvest/' + address).pipe(
        catchError(this.snackService.handleError<HarvestDto[]>(`history address harvest `))
    );
  }

  getAddressHistoryUni(address: string): Observable<UniswapDto[]> {
    return this.http.get<UniswapDto[]>(environment.apiEndpoint + '/history/uni/' + address).pipe(
        catchError(this.snackService.handleError<UniswapDto[]>(`history address uni `))
    );
  }

  getAddressHistoryTransfers(address: string): Observable<TransferDto[]> {
    return this.http.get<TransferDto[]>(environment.apiEndpoint + '/history/transfer/' + address).pipe(
        catchError(this.snackService.handleError<TransferDto[]>(`history address transfers `))
    );
  }

  getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
    return this.http.get<OhlcDto[]>(environment.apiEndpoint + '/api/transactions/history/uni/ohcl/' + coin).pipe(
        catchError(this.snackService.handleError<OhlcDto[]>(`history ohlc`))
    );
  }

  getLastPrices(): Observable<PricesDto[]> {
    return this.http.get<PricesDto[]>(environment.apiEndpoint + '/price/token/latest').pipe(
        catchError(this.snackService.handleError<PricesDto[]>(`last price `))
    );
  }

  getUserBalances(): Observable<Balance[]> {
    return this.http.get<Balance[]>(environment.apiEndpoint + '/user_balances').pipe(
        catchError(this.snackService.handleError<Balance[]>(`load balances`))
    );
  }

  getContractsVaults(): Observable<{ data: ContractVault[]; code: string }> {
    return this.http.get<ContractVault[]>(environment.apiEndpoint + '/contracts/vaults').pipe(
        catchError(this.snackService.handleError<ContractVault[]>(`contracts vaults`))
    );
  }
}
