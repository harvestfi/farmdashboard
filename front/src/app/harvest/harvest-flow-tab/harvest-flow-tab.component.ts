import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from '../../models/harvest-dto';
import {ViewTypeService} from '../../services/view-type.service';
import {TvlBoxComponent} from '../../dashboard/tvl-box/tvl-box.component';

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
    if (success) {
      switch (type.toLowerCase()) {
        case 'deposit':
          if (amount > 1000000) {
            return '#83b78c';
          } else if (amount > 200000) {
            return '#8cb894';
          } else if (amount > 50000) {
            return '#96ba9d';
          } else {
            return '#a1bca6';
          }
        case 'withdraw':
          if (amount > 1000000) {
            return '#c15b5b';
          } else if (amount > 200000) {
            return '#c36666';
          } else if (amount > 50000) {
            return '#c47272';
          } else {
            return '#c37d7d';
          }
      }
    } else {
      return '#474646';
    }
    return '#ffffff';
  }

  openEthersacanTx(hash: string): void {
    window.open('https://etherscan.io/tx/' + hash, '_blank');
  }

  getImgUrl(name: string): string {
    return TvlBoxComponent.getImgSrc(name);
  }

}
