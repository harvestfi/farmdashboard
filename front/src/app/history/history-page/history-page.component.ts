import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import {HarvestDto} from '../../models/harvest-dto';
import {UniswapDto} from '../../models/uniswap-dto';
import {Utils} from '../../utils';
import {NGXLogger} from 'ngx-logger';
import {StaticValues} from '../../static-values';

class CheckedValue {
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  private fullData = [];
  sortedData;
  includeFarm = false;
  vaults: CheckedValue[] = [];
  lps: CheckedValue[] = [];
  address;

  lastFarmHold: UniswapDto;
  lastLp = new Map<string, UniswapDto>();
  lastStaked = new Map<string, HarvestDto>();

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private log: NGXLogger) {
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
      if (Utils.isHarvest(record) && this.includeIn(this.vaults, record.vault)) {
        //we have it in liquidity
        if (this.isLiqHarvest(record)) {
          return;
        }
        this.sortedData.push(record);
      } else if (Utils.isUniTrade(record) && this.includeFarm) {
        this.sortedData.push(record);
      } else if (Utils.isUniLiq(record) && this.includeIn(this.lps, this.lpName(record))) {
        this.sortedData.push(record);
      }
    });
    this.sortedData.sort((o1, o2) => o2.blockDate - o1.blockDate);
  }

  includeIn(arr: CheckedValue[], name: string): boolean {
    const c = arr.find(el => el.value === name);
    if (c) {
      return c.checked;
    }
    return false;
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
    });
  }

  private parseHarvest(record: HarvestDto) {
    //we have it in liquidity
    if (this.isLiqHarvest(record)) {
      return;
    }
    const harvest = this.lastStaked.get(record.vault);
    this.addInCheckedArr(this.vaults, record.vault);
    if (harvest) {
      if (harvest.blockDate < record.blockDate) {
        this.lastStaked.set(record.vault, record);
      }
    } else {
      this.lastStaked.set(record.vault, record);
    }
  }

  private addInCheckedArr(arr: CheckedValue[], name: string) {
    if (arr.find(el => el.value === name)) {
      return;
    }
    const c = new CheckedValue();
    c.value = name;
    c.checked = false;
    arr.push(c);
  }

  private parseUniswap(record: UniswapDto) {
    if (Utils.isUniTrade(record)) {
      if (this.lastFarmHold) {
        if (this.lastFarmHold.blockDate < record.blockDate) {
          this.lastFarmHold = record;
        }
      } else {
        this.lastFarmHold = record;
      }
    } else if (Utils.isUniLiq(record)) {
      const lpName = this.lpName(record);
      this.addInCheckedArr(this.lps, lpName);
      const uni = this.lastLp.get(lpName);
      if (uni) {
        if (uni.blockDate < record.blockDate) {
          this.lastLp.set(lpName, record);
        }
      } else {
        this.lastLp.set(lpName, record);
      }
    }
  }

  tvl(): number {
    let tvl = this.lastFarmHold?.ownerBalanceUsd;
    this.lastLp?.forEach(lp => {
      tvl += lp.ownerBalanceUsd;
    });
    this.lastStaked?.forEach(harvest => {
      if (harvest.vault === 'PS' || harvest.vault === 'PS_V0') {
        return;
      }
      tvl += harvest.ownerBalanceUsd;
    });
    return tvl;
  }

  lpName(record: UniswapDto): string {
    return record.coin + '_' + record.otherCoin;
  }

  prettyVaultName(name: string) {
    return StaticValues.vaultPrettyName(name);
  }

  isLiqHarvest(record: HarvestDto) {
    return record.vault.includes('FARM');
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
    return StaticValues.getImgSrcForVault(name);
  }
}
