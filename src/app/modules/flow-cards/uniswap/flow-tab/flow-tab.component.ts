import {Component, Input, OnInit} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-flow-tab',
  templateUrl: './flow-tab.component.html',
  styleUrls: ['./flow-tab.component.css']
})
export class FlowTabComponent implements OnInit {
  @Input() maxHeight = 400;
  @Input() minAmount = 0;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  /**
   * @TODO: to remove
   */
  priceGradient(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type) {
        case 'ADD':
        case 'BUY':
          if (amount > 500) {
            return '#83b78c';
          } else if (amount > 250) {
            return '#9ab7a0';
          } else if (amount > 100) {
            return '#788579';
          } else {
            return '#4b544c';
          }
        case 'SELL':
        case 'REM':
          if (amount > 500) {
            return '#c15b5b';
          } else if (amount > 250) {
            return '#8f5d5d';
          } else if (amount > 100) {
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

  /**
   * @TODO: to remove
   */
  checkImportantOwner(address: string): string {
    if (address.toLowerCase() === '0xbed04c43e74150794f2ff5b62b4f73820edaf661'.toLowerCase()) {
      return 'doHardWork';
    }
    if (address.toLowerCase() === '0x843002b1d545ef7abb71c716e6179570582faa40'.toLowerCase()
        || address.toLowerCase() === '0x49d71131396f23f0bce31de80526d7c025981c4d'.toLowerCase()) {
      return 'devs';
    }
    return 'normal';
  }



}
