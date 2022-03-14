import { Component, OnInit } from '@angular/core';
import { UserBalanceService } from "@data/services/data/user-balance.service";
import {FormControl, Validators} from "@angular/forms";
import {ProfitList} from "@data/models/profit-list";
import {ViewTypeService} from "@data/services/view-type.service";
import {Utils} from "@data/static/utils";

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent implements OnInit {

  profit: ProfitList;

  addressControl =  new FormControl('0x91ebfee4f90adb3c64d5f171cd8d1efece9cfad8', [
    Validators.required,
    Validators.pattern(/^0x[a-fA-F0-9]{35,45}$/),
  ]);

  constructor(
      public userBalanceService: UserBalanceService,
      public viewTypeService: ViewTypeService,

      ) { }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    const address = this.addressControl.value;
    if (address == undefined) {
      return;
    }
    this.userBalanceService.getTotalProfitByVaults(address).subscribe(i => {
      this.profit = i;
    });
  }

  toProfit(value: string | undefined): string {
    if (value == undefined) {
      return '0';
    }

    return Utils.prettyNumber(Number(value));
  }
}
