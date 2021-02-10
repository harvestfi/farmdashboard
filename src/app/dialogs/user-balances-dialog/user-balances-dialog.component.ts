import {AfterViewInit, Component, Inject} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../dialog-data';
import {NGXLogger} from 'ngx-logger';
import {Balance} from '../../models/balance';

@Component({
  selector: 'app-user-balances-dialog',
  templateUrl: './user-balances-dialog.component.html',
  styleUrls: ['./user-balances-dialog.component.css']
})
export class UserBalancesDialogComponent implements AfterViewInit {
  userBalances: Balance[];

  constructor(private httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }


  private loadData(): void {
    this.httpService.getUserBalances().subscribe(data => {
      this.userBalances = data;
    });
  }

  shortAddress(address: string): string {
    return address.slice(0, 5) + '...' + address.slice(address.length - 4);
  }
}
