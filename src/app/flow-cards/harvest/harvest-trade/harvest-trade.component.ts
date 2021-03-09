import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from '../../../models/harvest-dto';
import {StaticValues} from '../../../static/static-values';
import {Utils} from '../../../static/utils';

@Component({
  selector: 'app-harvest-trade',
  templateUrl: './harvest-trade.component.html',
  styleUrls: ['./harvest-trade.component.scss']
})
export class HarvestTradeComponent implements OnInit {

  constructor() {
  }

  @Input() dto: HarvestDto;
  @Input() fullDate = false;
  openModal = false;

  ngOnInit(): void {
  }

  showTradeLinks(): void {
    this.openModal = !this.openModal;
  }

  hideTradeLinks(show: boolean): void {
    this.openModal = show;
  }

  priceGradientLight(type: string, amount: number, success: boolean): string {
    return Utils.priceGradientHarvest(type, amount, success);
  }

  getImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

}
