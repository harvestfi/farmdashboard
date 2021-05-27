import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Network} from '../../models/network';

@Injectable({
  providedIn: 'root'
})
export class RpcService {

  private http: HttpClient;

  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(this.httpBackend);
  }

  /**
   * approximate block time for ethereum is ~13 seconds.
   * approximate block time for bsc is 3 seconds.
   */
  getLastBlock(network: Network): Observable<number> {
    return timer(1, 14000).pipe(
        switchMap(() => this.http.post(network.rpcUrl, {
          jsonrpc: '2.0',
          id: network.chainId,
          method: 'eth_blockNumber',
          params: []
        }).pipe(
            map((data: { result: string }) => parseInt(data.result, 16))
        ))
    );
  }

}
