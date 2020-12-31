import { Component, AfterViewInit } from "@angular/core";
import { HttpService } from "../../services/http.service";
import { UniswapSubscriberService } from "../../uniswap/uniswap-subscriber.service";
import { StaticValues } from "src/app/static-values";
import { ViewTypeService } from "../../services/view-type.service";
import { Utils } from "../../utils";
import { NGXLogger } from "ngx-logger";
import { UniswapDto } from "../../models/uniswap-dto";
import { Title } from "@angular/platform-browser";
import { SnackService } from "../../services/snack.service";

@Component({
  selector: "app-uni-history-dialog",
  templateUrl: "./uni-history-dialog.component.html",
  styleUrls: ["./uni-history-dialog.component.css"],
})
export class UniHistoryDialogComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  dtosWhales: UniswapDto[] = [];
  txIds = new Set<string>();
  pureTitle = "Harvest Live Dashboard";
  private maxMessages = 25;
  whalesMoreThan = 500;
  latestBlock = 0;
  earliestBlock = 0;
  step = 4500;
  numberOfPages = 0;
  currentPage = 1;

  constructor(
    private txHistory: HttpService,
    private titleService: Title,
    private uniswapSubscriberService: UniswapSubscriberService,
    public vt: ViewTypeService,
    private snack: SnackService,
    private log: NGXLogger
  ) {}

  ngAfterViewInit(): void {
    this.txHistory.getUniswapTxHistoryData().subscribe(
      (data) => {
        this.latestBlock = data[data.length - 1].blockDate;
        this.earliestBlock =
          data[data.length - this.maxMessages].blockDate - this.step;
        console.log(this.latestBlock, this.earliestBlock);
        console.log(data);
        Utils.loadingOff();
        this.log.debug("tx data fetched", data.length);
        data.forEach((tx) => {
          UniswapDto.round(tx);
          this.saveLastValue(tx);
          if (tx.amount < this.whalesMoreThan) {
            this.addInArray(this.dtos, tx);
          } else {
            this.addInArray(this.dtosWhales, tx);
          }
        });
      },
      (err) => {
        Utils.loadingOff();
      }
    );

    this.uniswapSubscriberService.handlers.set(this, (tx) => {
      if (tx.coin !== "FARM") {
        return;
      }
      this.snack.openSnack(tx.print());
      if (!this.isUniqTx(tx)) {
        this.log.error("Not unique", tx);
        return;
      }
      if (tx.amount < this.whalesMoreThan) {
        this.addInArray(this.dtos, tx);
      } else {
        this.addInArray(this.dtosWhales, tx);
      }
      this.saveLastValue(tx);
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
    if (tx.type === "ADD" || tx.type === "REM") {
      return;
    }
    arr.unshift(tx);
    if (arr.length > this.maxMessages) {
      arr.pop();
    }
  }

  private saveLastValue(tx: UniswapDto): void {
    if (!tx.confirmed || tx.lastPrice === 0) {
      return;
    }
    if (tx.lastPrice != null && tx.lastPrice !== 0) {
      this.titleService.setTitle(tx.lastPrice + " | " + this.pureTitle);
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
    this.latestBlock -= this.step;
    this.earliestBlock -= this.step;
    this.txHistory
      .getOlderUniswapTxHistoryData(this.earliestBlock, this.latestBlock)
      .subscribe(
        (data) => {
          console.log(this.latestBlock, this.earliestBlock);
          console.log(data);
          Utils.loadingOff();
          this.log.debug("tx data fetched", data.length);
          data.forEach((tx) => {
            UniswapDto.round(tx);
            this.saveLastValue(tx);
            if (tx.amount < this.whalesMoreThan) {
              this.addInArray(this.dtos, tx);
            } else {
              this.addInArray(this.dtosWhales, tx);
            }
          });
        },
        (err) => {
          Utils.loadingOff();
        }
      );

    this.uniswapSubscriberService.handlers.set(this, (tx) => {
      if (tx.coin !== "FARM") {
        return;
      }
      this.snack.openSnack(tx.print());
      if (!this.isUniqTx(tx)) {
        this.log.error("Not unique", tx);
        return;
      }
      if (tx.amount < this.whalesMoreThan) {
        this.addInArray(this.dtos, tx);
      } else {
        this.addInArray(this.dtosWhales, tx);
      }
      this.saveLastValue(tx);
    });
  }

  toRecentTransactions():void {
    this.txHistory.getUniswapTxHistoryData().subscribe(
      (data) => {
        this.latestBlock = data[data.length - 1].blockDate;
        this.earliestBlock =
          data[data.length - this.maxMessages].blockDate - this.step;
        console.log(this.latestBlock, this.earliestBlock);
        console.log(data);
        Utils.loadingOff();
        this.log.debug("tx data fetched", data.length);
        data.forEach((tx) => {
          UniswapDto.round(tx);
          this.saveLastValue(tx);
          if (tx.amount < this.whalesMoreThan) {
            this.addInArray(this.dtos, tx);
          } else {
            this.addInArray(this.dtosWhales, tx);
          }
        });
      },
      (err) => {
        Utils.loadingOff();
      }
    );

    this.uniswapSubscriberService.handlers.set(this, (tx) => {
      if (tx.coin !== "FARM") {
        return;
      }
      this.snack.openSnack(tx.print());
      if (!this.isUniqTx(tx)) {
        this.log.error("Not unique", tx);
        return;
      }
      if (tx.amount < this.whalesMoreThan) {
        this.addInArray(this.dtos, tx);
      } else {
        this.addInArray(this.dtosWhales, tx);
      }
      this.saveLastValue(tx);
    });
  }
}
