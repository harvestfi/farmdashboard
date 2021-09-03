import {AfterViewInit, Component, Input} from '@angular/core';
import {HttpService} from '@data/services/http/http.service';
import {NGXLogger} from 'ngx-logger';
import {Balance} from '@data/models/balance';
import {ViewTypeService} from '@data/services/view-type.service';
import {Utils} from '@data/static/utils';

@Component({
  selector: 'app-user-balances',
  templateUrl: './user-balances.component.html',
  styleUrls: ['./user-balances.component.scss']
})
export class UserBalancesComponent implements AfterViewInit {
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

    getNetworkScan(): string {
        return Utils.getNetworkScanUrl('eth');
    }
}
