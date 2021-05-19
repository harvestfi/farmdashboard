import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UniswapDto} from '../../../models/uniswap-dto';
import {ViewTypeService} from '../../../services/view-type.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {UniswapDataService} from '../../../services/data/uniswap-data.service';

@Component({
  selector: 'app-uni-tx',
  templateUrl: './uni-tx.component.html',
  styleUrls: ['./uni-tx.component.scss'],
})
export class UniTxComponent implements AfterViewInit {
  @ViewChild('unitHistoryModal') private unitHistoryModal: CustomModalComponent;

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

}
