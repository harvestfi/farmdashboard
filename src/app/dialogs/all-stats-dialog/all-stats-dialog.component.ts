import {Component, OnInit} from '@angular/core';
import {StaticValues} from '../../static/static-values';
import {HardWorkDto} from '../../models/hardwork-dto';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {Sort} from '@angular/material/sort';
import { ViewTypeService } from 'src/app/services/view-type.service';

@Component({
  selector: 'app-all-stats-dialog',
  templateUrl: './all-stats-dialog.component.html',
  styleUrls: ['./all-stats-dialog.component.scss']
})
export class AllStatsDialogComponent implements OnInit {
  sortedVaults: string[];
  includeInactive = true;

  constructor(private pricesCalculationService: PricesCalculationService, public vt: ViewTypeService) {
    this.sortedVaults = StaticValues.vaults;
  }

  get tvls(): Map<string, number> {
    return this.pricesCalculationService.tvls;
  }

  get hardWorks(): Map<string, HardWorkDto> {
    return this.pricesCalculationService.lastHardWorks;
  }

  get psIncome(): number {
    return this.pricesCalculationService.psIncome();
  }

  get psApr(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  ngOnInit(): void {
  }

  users(name: string): number {
    return this.pricesCalculationService.vaultStats.get(name)?.owners;
  }

  incomeApr(tvlName: string): number {
    return this.pricesCalculationService.incomeApr(tvlName);
  }

  tvlPrettyName(tvlName: string): string {
    return tvlName?.replace('SUSHI_', '');
  }

  getImgSrc(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  sortData(sort: Sort): void {
    let vaults;
    if (this.includeInactive) {
      vaults = StaticValues.vaults;
    } else {
      vaults = Object.assign([], StaticValues.currentVaults);
    }
    if (!sort || !sort.active || sort.direction === '') {
      this.sortedVaults = vaults;
      return;
    }

    this.sortedVaults = vaults.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a, b, isAsc);
        case 'tvl':
          return this.compare(this.tvls.get(a), this.tvls.get(b), isAsc);
        case 'users' :
          return this.compare(this.users(a), this.users(b), isAsc);
        case 'income': {
          let incomeA;
          let incomeB;
          if (a !== 'PS') {
            incomeA = this.hardWorks.get(a)?.fullRewardUsdTotal;
          } else {
            incomeA = this.psIncome;
          }
          if (b !== 'PS') {
            incomeB = this.hardWorks.get(b)?.fullRewardUsdTotal;
          } else {
            incomeB = this.psIncome;
          }
          return this.compare(incomeA, incomeB, isAsc);
        }
        case 'income-apr': {
          let percA;
          let percB;
          if (a !== 'PS') {
            percA = this.pricesCalculationService.incomeApr(a);
          } else {
            percA = this.psApr * 52.14285714285714;
          }
          if (b !== 'PS') {
            percB = this.pricesCalculationService.incomeApr(b);
          } else {
            percB = this.psApr * 52.14285714285714;
          }
          return this.compare(percA, percB, isAsc);
        }
        case 'reward': {
          let rewardA;
          let rewardB;
          if (a !== 'PS') {
            rewardA = this.vaultReward(a);
          } else {
            rewardA = 0;
          }
          if (b !== 'PS') {
            rewardB = this.vaultReward(b);
          } else {
            rewardB = 0;
          }
          return this.compare(rewardA, rewardB, isAsc);
        }
        case 'reward-apr': {
          let rewardAprA;
          let rewardAprB;
          if (a !== 'PS') {
            rewardAprA = this.vaultRewardApr(a);
          } else {
            rewardAprA = 0;
          }
          if (b !== 'PS') {
            rewardAprB = this.vaultRewardApr(b);
          } else {
            rewardAprB = 0;
          }
          return this.compare(rewardAprA, rewardAprB, isAsc);
        }
        case 'all-apr': {
          let allAprA;
          let allAprB;
          if (a !== 'PS') {
            allAprA = this.vaultRewardApr(a) + this.pricesCalculationService.incomeApr(a);
          } else {
            allAprA = 0;
          }
          if (b !== 'PS') {
            allAprB = this.vaultRewardApr(b) + this.pricesCalculationService.incomeApr(b);
          } else {
            allAprB = 0;
          }
          return this.compare(allAprA, allAprB, isAsc);
        }
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  vaultReward(tvlName: string): number {
    return this.pricesCalculationService.vaultReward(tvlName);
  }

  vaultRewardPeriod(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardPeriod(tvlName);
  }

  vaultRewardApr(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardApr(tvlName);
  }
}
