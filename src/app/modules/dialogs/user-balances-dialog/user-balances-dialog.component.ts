import {AfterViewInit, Component, Input} from '@angular/core';
import {HttpService} from '@data/services/http/http.service';
import {NGXLogger} from 'ngx-logger';
import {Balance} from '@data/models/balance';
import {ViewTypeService} from '@data/services/view-type.service';
import {Utils} from '@data/static/utils';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-balances-dialog',
  templateUrl: './user-balances-dialog.component.html',
  styleUrls: ['./user-balances-dialog.component.scss'],
  providers: [DestroyService],
})
export class UserBalancesDialogComponent implements AfterViewInit {
  @Input('data') public data;
  userBalances: Balance[];
  public vt: ViewTypeService = new ViewTypeService();

  constructor(
    private httpService: HttpService,
    private log: NGXLogger,
    private destroy$: DestroyService,
  ) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }


  private loadData(): void {
    this.httpService.getUserBalances()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userBalances = data.filter(b => !isNaN(+b.balance) && b.balance !== Infinity);
      });
  }

  shortAddress(address: string): string {
    return address.slice(0, 5) + '...' + address.slice(address.length - 4);
  }

  getNetworkScan(): string {
    return Utils.getNetworkScanUrl('eth');
  }
}
