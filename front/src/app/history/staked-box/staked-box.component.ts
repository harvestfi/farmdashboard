import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from "../../models/harvest-dto";
import {Utils} from "../../utils";
import {TvlBoxComponent} from "../../dashboard/tvl-box/tvl-box.component";

@Component({
  selector: 'app-staked-box',
  templateUrl: './staked-box.component.html',
  styleUrls: ['./staked-box.component.css']
})
export class StakedBoxComponent implements OnInit {

  @Input() harvestDto: HarvestDto;

  constructor() {
  }

  ngOnInit(): void {
  }

  get getTitle() {
    if (this.isPositive()) {
      return '🏦Stake'
    }
    return "🏦Unstake"
  }

  isPositive(): boolean {
    return Utils.isHarvestPositive(this.harvestDto);
  }

  getImgUrl(name: string): string {
    return TvlBoxComponent.getImgSrc(name);
  }

  openEthersacanTx(hash: string): void {
    Utils.openEthersacanTx(hash);
  }

}
