import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from '../../models/harvest-dto';
import {ViewTypeService} from '../../services/view-type.service';
import {StaticValues} from "../../static-values";
import {Utils} from "../../utils";

@Component({
  selector: 'app-harvest-flow-tab',
  templateUrl: './harvest-flow-tab.component.html',
  styleUrls: ['./harvest-flow-tab.component.css']
})
export class HarvestFlowTabComponent implements OnInit {

  @Input() dtos: HarvestDto[] = [];
  @Input() maxHeight = 800;
  @Input() minAmount = 0;
  @Input() vaultFilter = 'all';

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  priceGradient(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type.toLowerCase()) {
        case 'deposit':
          if (amount > 1000000) {
            return '#83b78c';
          } else if (amount > 200000) {
            return '#9ab7a0';
          } else if (amount > 50000) {
            return '#788579';
          } else {
            return '#4b544c';
          }
        case 'withdraw':
          if (amount > 1000000) {
            return '#c15b5b';
          } else if (amount > 200000) {
            return '#8f5d5d';
          } else if (amount > 50000) {
            return '#694545';
          } else {
            return '#583e3e';
          }
      }
    } else {
      return '#474646';
    }
    return '#ffffff';
  }

  priceGradientLight(type: string, amount: number, success: boolean): string {
    return Utils.priceGradientHarvest(type, amount, success);
  }

  openHistory(hash: string): void {
    Utils.openHistory(hash);
  }

  getImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

}
