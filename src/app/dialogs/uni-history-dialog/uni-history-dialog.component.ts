import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { StaticValues } from 'src/app/static/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { UniswapDto } from '../../models/uniswap-dto';
import {UniswapService} from '../../services/http/uniswap.service';


@Component({
  selector: 'app-uni-history-dialog',
  templateUrl: './uni-history-dialog.component.html',
  styleUrls: ['./uni-history-dialog.component.scss'],
})
export class UniHistoryDialogComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  txIds = new Set<string>();
  lowestBlockDate = 999999999999;
  disabled = false;


  constructor(
    private txHistory: UniswapService,
    public vt: ViewTypeService,
    private log: NGXLogger
  ) {
  }

  ngAfterViewInit(): void {

    this.txHistory.getUniswapTxHistoryData().subscribe(data => this.addInArray(data));
  }

  getOlderTransactions(): void {
    this.disabled = true;
    if (this.lowestBlockDate === 0) {
      return;
    }
    this.txHistory
      .getUniswapTxHistoryByRange(this.lowestBlockDate - (StaticValues.SECONDS_OF_DAY * 2), this.lowestBlockDate)
      .subscribe(data => this.addInArray(data)).add(() => this.disabled = false);
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

  private addInArray(newValues: UniswapDto[]): void {

    this.log.info('New values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const tx = newValues[i];
      if (tx.type === 'ADD' || tx.type === 'REM') {
        continue;
      }
      if (!this.isUniqTx(tx)) {
        this.log.warn('Not unique transaction', tx);
        continue;
      }
      if (tx.blockDate < this.lowestBlockDate) {
        this.lowestBlockDate = tx.blockDate;
      }
      UniswapDto.round(tx);
      this.dtos.push(tx);

    }
  }
}
