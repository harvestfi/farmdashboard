import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {HarvestDto} from "../../models/harvest-dto";
import {UniswapDto} from "../../models/uniswap-dto";
import {DatePipe} from "@angular/common";
import {Utils} from "../../utils";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  private datepipe = new DatePipe('en-US')
  private fullData = [];
  sortedData = [];
  stakedMap = new Map<number, number>();
  farmMap = new Map<number, number>();
  farmLpMap = new Map<number, number>();
  stakedSum = 0;
  farmSum = 0;
  farmLpSum = 0;
  includeFarm = true;
  includeStaked = true;
  includeLpFarm = true;

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.http.getAddressHistoryHarvest(params['address']).subscribe(data => {
            data?.forEach(harvest => {
              HarvestDto.enrich(harvest);
              this.fullData.push(harvest);
            });
            this.http.getAddressHistoryUni(params['address']).subscribe(data => {
                  data?.forEach(uni => {
                    UniswapDto.round(uni);
                    this.fullData.push(uni);
                  });
                  this.sortValues();
                  this.parseValues();
                }
            );
          }
      );
    });
  }

  sortValues(): void {
    this.sortedData = [];
    this.fullData.forEach(record => {
      if (Utils.isHarvest(record) && this.includeStaked) {
        this.sortedData.push(record);
      } else if (Utils.isUniTrade(record) && this.includeFarm) {
        this.sortedData.push(record);
      } else if (Utils.isUniLiq(record) && this.includeLpFarm) {
        this.sortedData.push(record);
      }
    });
    this.sortedData.sort((o1, o2) => o1.blockDate - o2.blockDate);
  }

  parseValues(): void {
    this.fullData.sort((o1, o2) => o1.blockDate - o2.blockDate)
    .forEach(record => {
      if (Utils.isHarvest(record)) {
        this.parseHarvest(record);
      } else if (Utils.isUni(record)) {
        this.parseUniswap(record);
      } else {
        this.log.warn('Unknown record type', record);
      }
    })
  }

  private parseHarvest(record: HarvestDto) {
    if (Utils.isHarvestPositive(record)) {
      this.stakedSum += record.usdAmount;
    } else if (Utils.isHarvestNegative(record)) {
      this.stakedSum -= record.usdAmount;
    } else {
      this.log.warn('Unknown harvest record', record);
    }
    this.stakedMap.set(record.blockDate, this.stakedSum);
  }

  private parseUniswap(record: UniswapDto) {
    if (record.type === 'BUY') {
      this.farmSum += record.amount;
    } else if (record.type === 'SELL') {
      this.farmSum -= record.amount;
    } else if (record.type === 'ADD') {
      this.farmLpSum += record.amount;
    } else if (record.type === 'REM') {
      this.farmLpSum -= record.amount;
    } else {
      this.log.warn('Unknown uniswap record', record);
    }
    this.farmMap.set(record.blockDate, this.farmSum);
    this.farmLpMap.set(record.blockDate, this.farmLpSum);
  }

  printRecord(record: any): string {
    if (Utils.isHarvest(record)) {
      return this.printHarvest(record)
    } else if (Utils.isUni(record)) {
      return this.printUniswap(record)
    } else {
      this.log.warn('Unknown record for print', record);
    }
  }

  private printHarvest(record: HarvestDto) {
    return this.datepipe.transform(record.blockDate * 1000, 'dd-MMM-yyyy HH:mm:ss') + ' '
        + record.methodName + ' '
        + record.vault + ' '
        + record.amount.toFixed(2) + ' '
        + record.usdAmount.toFixed(2) + '$ '
        ;
  }

  private printUniswap(record: UniswapDto) {
    return this.datepipe.transform(record.blockDate * 1000, 'dd-MMM-yyyy HH:mm:ss') + ' '
        + record.type + ' '
        + record.amount.toFixed(2) + ' '
        + record.coin + ' '
        + record.otherAmount.toFixed(2) + ' '
        + record.otherCoin + ' '
        ;
  }

  balanceAtDate(record: any): string {
    if (Utils.isHarvest(record)) {
      return 'Staked ' + this.stakedMap.get(record.blockDate).toFixed(2) + '$';
    } else if (Utils.isUniTrade(record)) {
      return 'Hold ' + this.farmMap.get(record.blockDate).toFixed(2) + ' FARM';
    }
    if (Utils.isUniLiq(record)) {
      return 'FARM in LP ' + this.farmLpMap.get(record.blockDate).toFixed(2);
    } else {
      this.log.warn('Unknown record for balance', record);
    }
  }

  isPositive(record: any): boolean {
    return Utils.isHarvestPositive(record) || Utils.isUniPositive(record);
  }

  isNegative(record: any): boolean {
    return Utils.isHarvestNegative(record) || Utils.isUniNegative(record);
  }

  isHarvest(record: any): boolean {
    return Utils.isHarvest(record);
  }

  isUni(record: any): boolean {
    return Utils.isUni(record);
  }
}
