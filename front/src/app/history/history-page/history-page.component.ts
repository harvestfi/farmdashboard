import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {HarvestDto} from "../../models/harvest-dto";
import {UniswapDto} from "../../models/uniswap-dto";
import {Utils} from "../../utils";
import {NGXLogger} from "ngx-logger";
import {StaticValues} from "../../static-values";
import {TvlBoxComponent} from "../../dashboard/tvl-box/tvl-box.component";

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  private fullData = [];
  sortedData;
  stakedMap = new Map<string, Map<number, number>>();
  farmMap = new Map<number, number>();
  farmLpMap = new Map<number, number>();
  stakedSum = new Map<string, number>();
  farmSum = 0;
  farmLpSum = 0;
  includeFarm = true;
  includeStaked = true;
  includeLpFarm = true;
  vaults = new Set<string>();
  address;

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private log: NGXLogger) {
    StaticValues.vaults.forEach(vault => {
      this.stakedMap.set(vault, new Map<number, number>());
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.address = params['address'];
      this.http.getAddressHistoryHarvest(this.address).subscribe(data => {
            data?.forEach(harvest => {
              HarvestDto.enrich(harvest);
              this.fullData.push(harvest);
            });
            this.http.getAddressHistoryUni(this.address).subscribe(data => {
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
    this.sortedData.sort((o1, o2) => o2.blockDate - o1.blockDate);
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
    this.vaults.add(record.vault);
    const vaultMap = this.stakedMap.get(record.vault);
    let sum = this.stakedSum.get(record.vault);
    if (!sum) {
      sum = 0;
    }
    if (Utils.isHarvestPositive(record)) {
      sum += record.usdAmount;
    } else if (Utils.isHarvestNegative(record)) {
      sum -= record.usdAmount;
    } else {
      this.log.warn('Unknown harvest record', record);
    }
    this.stakedSum.set(record.vault, sum);
    vaultMap.set(record.blockDate, sum);
  }

  private parseUniswap(record: UniswapDto) {
    if (record.type === 'BUY') {
      this.farmSum += record.amount;
    } else if (record.type === 'SELL') {
      this.farmSum -= record.amount;
    } else if (record.type === 'ADD') {
      this.farmLpSum += this.lpAmount(record);
    } else if (record.type === 'REM') {
      this.farmLpSum -= this.lpAmount(record);
    } else {
      this.log.warn('Unknown uniswap record', record);
    }
    this.farmMap.set(record.blockDate, this.farmSum);
    this.farmLpMap.set(record.blockDate, this.farmLpSum);
  }

  private lpAmount(record: UniswapDto): number {
    return (record.amount * record.lastPrice * 2);
  }

  balanceAtDate(record: any): string {
    if (Utils.isHarvest(record)) {
      try {
        return record.vault + ' ' + record.ownerBalanceUsd.toFixed(2) + '$';
      } catch (e) {
        return 'Error ' + record.vault
      }
    } else if (Utils.isUniTrade(record)) {
      return '🚜Hold ' + record.ownerBalance?.toFixed(2) + ' ' + record.coin;
    }
    if (Utils.isUniLiq(record)) {
      return '💰LP ' + record.ownerBalanceUsd?.toFixed(2) + '$';
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

  getImgUrl(name: string): string {
    return TvlBoxComponent.getImgSrc(name);
  }
}
