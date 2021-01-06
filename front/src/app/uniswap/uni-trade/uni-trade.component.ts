import {Component, Input, OnInit} from '@angular/core';
import {UniswapDto} from '../../models/uniswap-dto';
import {Utils} from '../../utils';

@Component({
  selector: 'app-uni-trade',
  templateUrl: './uni-trade.component.html',
  styleUrls: ['./uni-trade.component.css']
})
export class UniTradeComponent implements OnInit {
  @Input() dto: UniswapDto;
  @Input() fullDate = false;

  constructor() {
  }

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

  checkImportantOwner(address: string): string {
    if (address === '0xbed04c43e74150794f2ff5b62b4f73820edaf661') {
      return 'doHardWork';
    }
    if (address === '0x843002b1d545ef7abb71c716e6179570582faa40' || address === '0x49d71131396f23f0bce31de80526d7c025981c4d') {
      return 'devs';
    }
    return 'normal';
  }

}
