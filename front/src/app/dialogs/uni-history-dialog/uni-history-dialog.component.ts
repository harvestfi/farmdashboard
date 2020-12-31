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
  private maxMessages = 350;
  latestBlock = 0;
  earliestBlock = 0;
  step = 4500;

  constructor(
    private txHistory: HttpService,
    public vt: ViewTypeService,
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
        
        this.log.debug("tx data fetched", data.length);
        data.forEach((tx) => {
          UniswapDto.round(tx);
          
          
            this.addInArray(this.dtos, tx);
          
        });
      },
      (err) => {
        console.log(err)
      }
    );

   
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

  

  getOlderTransactions(): void {
    this.latestBlock -= this.step;
    this.earliestBlock -= this.step;
    this.txHistory
      .getUniswapTxHistoryByRange(this.earliestBlock, this.latestBlock)
      .subscribe(
        (data) => {
          console.log(data);
          Utils.loadingOff();
          this.log.debug("tx data fetched", data.length);
          data.forEach((tx) => {
            UniswapDto.round(tx);
            
            
          });
        },
        (err) => {
          Utils.loadingOff();
        }
      );

    
  }

  
}
