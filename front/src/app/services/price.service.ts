import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SnackService} from './snack.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Price} from '../models/price';
import {OhlcDto} from '../models/ohlc-dto';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private url = 'api/token';

  constructor(private http: HttpClient, private snackService: SnackService) {
  }

  getUniswapOHLC(coin: string): Observable<OhlcDto[]> {
    return this.http.get<OhlcDto[]>('api/transactions/history/uni/ohcl/' + coin).pipe(
      catchError(this.snackService.handleError<OhlcDto[]>(`history ohlc`))
    );
  }

  getLastData(from: string): Observable<Price[]> {
    return this.http.get<Price[]>(`${this.url}/last/FARM/${from}`).pipe(
      catchError(this.snackService.handleError<Price[]>(`last Price ${from}`))
    );
  }
}
