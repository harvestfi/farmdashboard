import { Component, Input, OnInit } from '@angular/core';
import { HardWorkDto } from 'src/app/models/hardwork-dto';
import {StaticValues} from '../../static-values';
import {Utils} from '../../utils';


@Component({
  selector: 'app-hardwork-trade',
  templateUrl: './hardwork-trade.component.html',
  styleUrls: ['./hardwork-trade.component.css']
})
export class HardworkTradeComponent implements OnInit {

  constructor() { }
  @Input() dto: HardWorkDto;
  openModal = false;

  ngOnInit(): void {
  }
  priceGradientLight(type: string, amount: number, success: boolean): string {
    return Utils.priceGradientHarvest(type, amount, success);
  }

  getImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

}
