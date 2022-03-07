import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { HttpService } from '@data/services/http/http.service';
import { NGXLogger } from 'ngx-logger';
import { Balance } from '@data/models/balance';
import { ViewTypeService } from '@data/services/view-type.service';
import { Utils } from '@data/static/utils';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-balances',
  templateUrl: './user-balances.component.html',
  styleUrls: ['./user-balances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class UserBalancesComponent implements AfterViewInit {
  @Input('data') public data;
  
  public userBalances: Balance[];
  public ethNetworkScan: string = Utils.getNetworkScanUrl('eth');
  public vt: ViewTypeService = new ViewTypeService();
  
  constructor(
    private httpService: HttpService,
    private log: NGXLogger,
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
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
        
        this.changeDetectorRef.detectChanges()
      });
  }
  
  shortAddress(address: string): string {
    return address.slice(0, 5) + '...' + address.slice(address.length - 4);
  }
}
