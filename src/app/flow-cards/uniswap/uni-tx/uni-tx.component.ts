import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UniswapDto} from '../../../models/uniswap-dto';
import {NGXLogger} from 'ngx-logger';
import {ViewTypeService} from '../../../services/view-type.service';
import {SnackService} from '../../../services/snack.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {UniswapService} from '../../../services/http/uniswap.service';
import {PriceDataService} from '../../../services/data/price-data.service';

@Component({
  selector: 'app-uni-tx',
  templateUrl: './uni-tx.component.html',
  styleUrls: ['./uni-tx.component.scss'],
})
export class UniTxComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  txIds = new Set<string>();
  private maxMessages = 50;
  @ViewChild('unitHistoryModal') private unitHistoryModal: CustomModalComponent;

  constructor(
      private uniswapService: UniswapService,
      private priceData: PriceDataService,
      public vt: ViewTypeService,
      private snack: SnackService,
      private log: NGXLogger,
      private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.uniswapService.getUniswapTxHistoryData().subscribe(
        (data) => {
          this.log.debug('tx data fetched', data);
          data?.forEach((tx) => {
            UniswapDto.round(tx);
            this.addInArray(this.dtos, tx);
          });
        }
    );
    this.priceData.subscribeToActual().subscribe(priceDto => {
      const price = priceDto.price * this.priceData.getUsdPrice(priceDto.otherTokenAddress, priceDto.network);
      const tx = priceDto.toUniswap();
      tx.lastPrice = price;
      if (tx.coin !== 'FARM') {
        return;
      }
      if (!this.isUniqTx(tx)) {
        this.log.error('Not unique', tx);
        return;
      }
      this.snack.openSnack(tx.print());
      this.addInArray(this.dtos, tx);
    });
  }

  private isUniqTx(tx: UniswapDto): boolean {
    if (this.txIds.has(tx.id)) {
      return false;
    }
    this.txIds.add(tx.id);
    if (this.txIds.size > 100_000) {
      this.txIds = new Set<string>();
    }
    return true;
  }

  private addInArray(arr: UniswapDto[], tx: UniswapDto): void {
    if (tx.type === 'ADD' || tx.type === 'REM' || tx.coin !== 'FARM') {
      return;
    }
    arr.push(tx);
    if (arr.length > this.maxMessages) {
      arr.pop();
    }
  }

  openUniHistory(): void {
    this.unitHistoryModal.open();
  }

}
