import {Component, Input, OnInit} from '@angular/core';
import {UniswapDto} from "../../models/uniswap-dto";
import {Utils} from "../../utils";

@Component({
  selector: 'app-trade-box',
  templateUrl: './trade-box.component.html',
  styleUrls: ['./trade-box.component.css']
})
export class TradeBoxComponent implements OnInit {

  @Input() uniswapDto: UniswapDto;

  constructor() {
  }

  ngOnInit(): void {
  }

  get getTitle() {
    if (this.isTrade()) {
      return '💸Trade'
    } else {
      return '💰Liquidity'
    }
  }

  isPositive(): boolean {
    return Utils.isUniPositive(this.uniswapDto);
  }

  isTrade(): boolean {
    return Utils.isUniTrade(this.uniswapDto);
  }

  openEthersacanTx(hash: string): void {
    Utils.openEthersacanTx(hash);
  }

}
