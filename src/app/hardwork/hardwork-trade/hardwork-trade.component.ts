import { Component, Input, OnInit } from '@angular/core';
import { HardWorkDto } from 'src/app/models/hardwork-dto';
import {StaticValues} from '../../static-values';
import {Utils} from '../../utils';


@Component({
  selector: 'app-hardwork-trade',
  templateUrl: './hardwork-trade.component.html',
  styleUrls: ['./hardwork-trade.component.scss']
})
export class HardworkTradeComponent implements OnInit {

  constructor() { }
  @Input() dto: HardWorkDto;
  @Input() fullDate = false;
  @Input() moreColumns = false;
  openModal = false;
  hash = '';

  ngOnInit(): void {
    const temp = this.dto.id.split('_');
    this.hash = temp[0];

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
