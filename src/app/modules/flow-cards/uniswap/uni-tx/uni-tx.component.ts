import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UniswapDto} from '@data/models/uniswap-dto';
import {ViewTypeService} from '@data/services/view-type.service';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {UniswapDataService} from '@data/services/data/uniswap-data.service';

@Component({
  selector: 'app-uni-tx',
  templateUrl: './uni-tx.component.html',
  styleUrls: ['./uni-tx.component.scss'],
})
export class UniTxComponent implements AfterViewInit {
  @ViewChild('unitHistoryModal') private unitHistoryModal: CustomModalComponent;
  minAmount = 0;
  openedModal = {};
  constructor(
      private uniswapData: UniswapDataService,
      public vt: ViewTypeService,
  ) {
  }

  ngAfterViewInit(): void {
  }

  get dtos(): UniswapDto[] {
    return this.uniswapData.farmTrades;
  }

  openUniHistory(): void {
    this.unitHistoryModal.open();
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

  showTradeLinks(dtoId: string): void {
    this.openedModal[dtoId] = true;
  }

  hideTradeLinks(dtoId: string): void {
    this.openedModal[dtoId] = false;
  }

}
