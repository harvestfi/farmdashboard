import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from '../../models/harvest-dto';
import { StaticValues } from '../../static-values';
import {Utils} from '../../utils';

@Component({
  selector: 'app-harvest-trade',
  templateUrl: './harvest-trade.component.html',
  styleUrls: ['./harvest-trade.component.css']
})
export class HarvestTradeComponent implements OnInit {

  constructor() { }
  @Input() dto: HarvestDto;
  @Input() fullDate = false;
  openModal = false;
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

  showTradeLinks(): void {
    this.openModal = !this.openModal;
  }
  hideTradeLinks(): void {
    this.openModal = false;
  }
  priceGradientLight(type: string, amount: number, success: boolean): string {
    return Utils.priceGradientHarvest(type, amount, success);
  }

  

  getImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

}
