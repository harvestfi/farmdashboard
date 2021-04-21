import {Component, OnInit} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {ViewTypeService} from 'src/app/services/view-type.service';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {HarvestDataService} from '../../services/data/harvest-data.service';
import {HardworkDataService} from '../../services/data/hardwork-data.service';

@Component({
  selector: 'app-all-stats-dialog',
  templateUrl: './all-stats-dialog.component.html',
  styleUrls: ['./all-stats-dialog.component.scss']
})
export class AllStatsDialogComponent implements OnInit {
  vaults: Vault[];
  sortedVaults: string[];
  includeInactive = true;

  constructor(private harvestData: HarvestDataService,
              private hardworkData: HardworkDataService,
              public vt: ViewTypeService,
              private contractsService: ContractsService) {
  }

  tvl(vaultName: string): number {
    return this.harvestData.getVaultTvl(vaultName, 'eth');
  }

  fullRewardUsdTotal(name: string): number {
    return 0;
  }

  get psIncome(): number {
    return 0;
  }

  get psApr(): number {
    return 0;
  }

  ngOnInit(): void {
    this.contractsService.getContracts(Vault).subscribe(vaults => {
      this.vaults = vaults;
      this.sortedVaults = vaults.map(_ => _.contract.name);
    });
  }

  users(name: string): number {
    return this.harvestData.getVaultLastInfo(name, 'eth')?.ownerCount;
  }

  incomeApr(tvlName: string): number {
    return 0;
  }

  sortData(sort: Sort): void {
    let vaults;
    if (this.includeInactive) {
      vaults = this.vaults.map(_ => _.contract.name);
    } else {
      vaults = this.vaults.filter(_ => _.isActive()).map(_ => _.contract.name);
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
          return this.compare(this.tvl(a), this.tvl(b), isAsc);
        case 'users' :
          return this.compare(this.users(a), this.users(b), isAsc);
        case 'income': {
          let incomeA;
          let incomeB;
          if (a !== 'PS') {
            incomeA = this.fullRewardUsdTotal(a);
          } else {
            incomeA = this.psIncome;
          }
          if (b !== 'PS') {
            incomeB = this.fullRewardUsdTotal(b);
          } else {
            incomeB = this.psIncome;
          }
          return this.compare(incomeA, incomeB, isAsc);
        }
        case 'income-apr': {
          let percA;
          let percB;
          if (a !== 'PS') {
            percA = this.incomeApr(a);
          } else {
            percA = this.psApr * 52.14285714285714;
          }
          if (b !== 'PS') {
            percB = this.incomeApr(b);
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
            allAprA = this.vaultRewardApr(a) + this.incomeApr(a);
          } else {
            allAprA = 0;
          }
          if (b !== 'PS') {
            allAprB = this.vaultRewardApr(b) + this.incomeApr(b);
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
    return 0;
  }

  vaultRewardApr(tvlName: string): number {
    return 0;
  }
}
