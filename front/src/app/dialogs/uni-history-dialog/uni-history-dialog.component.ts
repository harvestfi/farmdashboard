import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { StaticValues } from 'src/app/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { UniswapDto } from '../../models/uniswap-dto';
import { Title } from "@angular/platform-browser";


@Component({
  selector: 'app-uni-history-dialog',
  templateUrl: './uni-history-dialog.component.html',
  styleUrls: ['./uni-history-dialog.component.css'],
})
export class UniHistoryDialogComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  dtosWhales: UniswapDto[] = [];
  txIds = new Set<string>();
  pureTitle = "Harvest Live Dashboard";
  latestBlock = 0;
  earliestBlock = 0;

  constructor(
    private txHistory: HttpService,
    public vt: ViewTypeService,
    private titleService: Title,
    private log: NGXLogger
  ) { }

  ngAfterViewInit(): void {
    this.txHistory.getUniswapTxHistoryData().subscribe(
      (data) => {
        this.log.debug('tx data fetched', data.length);
        console.log(data)
        data.forEach((tx) => {
          this.latestBlock = data[data.length - 1].blockDate;
          this.earliestBlock = this.latestBlock - (StaticValues.SECONDS_OF_DAY * 2);
          UniswapDto.round(tx);

          if (!this.isUniqTx(tx)) {
            this.log.error('Not unique', tx);
            return;
          }
          this.addInArray(this.dtos, tx);

        });
      },
      (err) => {
        console.log(err);
      }
    );


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
    if (tx.type === 'ADD' || tx.type === 'REM') {
      return;
    }
    arr.unshift(tx);
  }
  private appendArray(arr: UniswapDto[], tx: UniswapDto): void {
    if (tx.type === 'ADD' || tx.type === 'REM') {
      return;
    }
    arr.push(tx)
  }


  private saveLastValue(tx: UniswapDto): void {
    if (!tx.confirmed || tx.lastPrice === 0) {
      return;
    }
    if (tx.lastPrice != null && tx.lastPrice !== 0) {
      this.titleService.setTitle(tx.lastPrice + ' | ' + this.pureTitle);
      StaticValues.lastPrice = tx.lastPrice;
    }
    if (tx.lastGas != null || tx.lastGas !== 0) {
      StaticValues.lastGas = tx.lastGas;
    }
    if (tx.blockDateAdopted != null) {
      StaticValues.lastBlockDateAdopted = tx.blockDateAdopted;
    }
    if (tx.psWeekApy) {
      StaticValues.lastPsApy = tx.psWeekApy;
    }
    if (tx.psIncomeUsd) {
      StaticValues.psIncomeUsd = tx.psIncomeUsd;
    }
    if (tx.ownerCount) {
      StaticValues.farmUsers = tx.ownerCount;
    }
  }

  getOlderTransactions(): void {

    this.txHistory

      .getUniswapTxHistoryByRange(this.earliestBlock, this.latestBlock)
      .subscribe(
        (data) => {
          console.log(data);
          this.earliestBlock = this.earliestBlock - StaticValues.SECONDS_OF_DAY;
          console.log(StaticValues.SECONDS_OF_DAY)
          this.log.debug('tx data fetched', data.length);
          data.forEach((tx) => {
            UniswapDto.round(tx);
            if (!this.isUniqTx(tx)) {
              // this.log.error('Not unique', tx);
              return;
            }
            else {
              this.saveLastValue(tx);
              this.appendArray(this.dtos, tx);

            }


          });
        },
        (err) => {

        }
      );


  }


}
