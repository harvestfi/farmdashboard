import {AfterViewInit, Component, Input} from '@angular/core';
import {HttpService} from '../../services/http/http.service';
import {NGXLogger} from 'ngx-logger';
import {Balance} from '../../models/balance';
import {ViewTypeService} from 'src/app/services/view-type.service';
import {Utils} from '../../static/utils';

@Component({
  selector: 'app-user-balances-dialog',
  templateUrl: './user-balances-dialog.component.html',
  styleUrls: ['./user-balances-dialog.component.css']
})
export class UserBalancesDialogComponent implements AfterViewInit {
  @Input('data') public data;
  userBalances: Balance[];
  public vt: ViewTypeService = new ViewTypeService();

  constructor(private httpService: HttpService,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }


  private loadData(): void {
    this.httpService.getUserBalances().subscribe(data => {
      this.userBalances = data
      .filter(b => !isNaN(+b.balance) && b.balance !== Infinity);
    });
  }

  shortAddress(address: string): string {
    return address.slice(0, 5) + '...' + address.slice(address.length - 4);
  }

  getNetworkScan() {
    return Utils.getNetworkScanUrl('eth');
  }
}
