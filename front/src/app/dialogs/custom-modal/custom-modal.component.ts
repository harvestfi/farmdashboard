import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {UniswapDto} from '../../models/uniswap-dto';
@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit {
  @Input() txHash: string;
  @Input() address: string;
  @Input()  showModal: boolean;
  @Input() txDate: string;
  @Input() dto: UniswapDto;

  constructor() { }

  ngOnInit(): void {
  }

  openEthersacanTx(hash: string): void {
    window.open('https://etherscan.io/tx/' + hash, '_blank');
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

  closeModal(): void {
    this.showModal = false;
  }

}

