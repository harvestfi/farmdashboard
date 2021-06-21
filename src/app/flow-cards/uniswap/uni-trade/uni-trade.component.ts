import {Component, Input, OnInit} from '@angular/core';
import { ViewTypeService } from 'src/app/services/view-type.service';
import {UniswapDto} from '../../../models/uniswap-dto';
import {Utils} from '../../../static/utils';

@Component({
  selector: 'app-uni-trade',
  templateUrl: './uni-trade.component.html',
  styleUrls: ['./uni-trade.component.scss']
})
export class UniTradeComponent implements OnInit {

  constructor(public vt: ViewTypeService) {
  }

  @Input() dto: UniswapDto;
  @Input() fullDate = false;
  openModal = false;

  ngOnInit(): void {
  }

  priceGradient(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type) {
        case 'ADD':
        case 'BUY':
          if (amount > 250) {
            return '#83b78c';
          } else if (amount > 100) {
            return '#8cb894';
          } else if (amount > 50) {
            return '#96ba9d';
          } else {
            return '#a1bca6';
          }
        case 'SELL':
        case 'REM':
          if (amount > 250) {
            return '#c15b5b';
          } else if (amount > 100) {
            return '#c36666';
          } else if (amount > 50) {
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

  openHistory(hash: string): void {
    Utils.openHistory(hash);
  }

  showTradeLinks(): void {
    this.openModal = !this.openModal;
  }

  hideTradeLinks(show: boolean): void {
    this.openModal = show;
  }

  checkImportantOwner(dto: UniswapDto): string {
    const address = dto.owner;
    if (address.toLowerCase() === '0xbed04c43e74150794f2ff5b62b4f73820edaf661'.toLowerCase()
        || address.toLowerCase() === '0xed1eac72063476e04997fbefa19dcaea008e2aa5'.toLowerCase()
        || dto.methodName === 'doHardWork') {
      return 'doHardWork';
    }
    if (address === '0x843002b1d545ef7abb71c716e6179570582faa40' || address === '0x49d71131396f23f0bce31de80526d7c025981c4d') {
      return 'devs';
    }
    return 'normal';
  }

}
