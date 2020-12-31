import {Component, Input, OnInit} from '@angular/core';
import {UniswapDto} from "../../models/uniswap-dto";
import {Utils} from "../../utils";
import {StaticValues} from "../../static-values";
import {HarvestDto} from "../../models/harvest-dto";

@Component({
  selector: 'app-trade-box',
  templateUrl: './trade-box.component.html',
  styleUrls: ['./trade-box.component.css']
})
export class TradeBoxComponent implements OnInit {

  @Input() uniswapDto: UniswapDto;
  @Input() harvestDto: HarvestDto;

  constructor() {
  }

  ngOnInit(): void {
  }

  get getTitle() {
    if (this.uniswapDto) {
      if (this.isTrade()) {
        return '💸'
      } else {
        return '💰'
      }
    }
    if (this.isPositive()) {
      return '🏦'
    }
    return "🏦"
  }

  isPositive(): boolean {
    if (this.uniswapDto) {
      return Utils.isUniPositive(this.uniswapDto);
    }
    return Utils.isHarvestPositive(this.harvestDto);
  }

  isTrade(): boolean {
    return Utils.isUniTrade(this.uniswapDto);
  }

  openEthersacanTx(hash: string): void {
    Utils.openEthersacanTx(hash);
  }

  getCoinImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  getColor(): string {
    if (this.isPositive()) {
      return '#478c54';
    }
    return '#c15b5b';
  }

  isUni(): boolean {
    return !this.harvestDto;
  }

}
