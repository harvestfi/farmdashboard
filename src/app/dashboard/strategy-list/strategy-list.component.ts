import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {PricesCalculationService} from 'src/app/services/prices-calculation.service';
import {Utils} from '../../static/utils';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent implements AfterViewInit{
  public searchTerm = '';
  public networkFilter = '';
  public platformFilter = '';
  public assetFilter = '';
  // Mutating the currentVaults in static values before using it so that we
  // are able to sort this array and not get a new one from the service.
  public vaultsList = [];
  public apyWindowState: Record<string, boolean> = {};
  // false = desc, true = asc
  public sortDirection = false;
  private currentSortingValue = 'tvl';

  @ViewChildren(CustomModalComponent) private tvlModals: QueryList<CustomModalComponent>;

  constructor(
      public vt: ViewTypeService,
      public pricesCalculationService: PricesCalculationService,
      private contractsService: ContractsService,
      private log: NGXLogger
  ) {
  }

  ngAfterViewInit(): void {
    this.contractsService.getContracts(Vault).subscribe(vaults => {
      this.vaultsList = vaults.filter(_ => _.isActive()).map(v => v.contract);
      console.log('======', vaults);
      this.log.info('Loaded contracts', this.vaultsList);
      this.sortVaultsList(this.currentSortingValue);
    });
  }

  get vaults(): string[] {
    // If there is a search term, we filter, otherwise we return
    // the vaults list
    this.sortVaultsList(this.currentSortingValue);
    if (this.searchTerm) {
      return this.vaultsList.filter(vault =>
          vault.name.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())
      );
    }
    return this.vaultsList;
  }

  toggleAPYWindow(name: string): void {
    if (!(name in this.apyWindowState)) {
      this.apyWindowState[name] = true;
      return;
    }
    this.apyWindowState[name] = !this.apyWindowState[name];
  }

  sortVaultsList(sortBy?: string): void{
    this.currentSortingValue = sortBy;
    this.vaultsList.sort((a: any, b: any): number => {
      const left = this.sortDirection  ? a : b;
      const right = this.sortDirection ? b : a;
      // This is not ideal, but it's a decent way to handle
      // sorting given the current data :)
      switch (sortBy) {
        case 'name':
          if (left.name < right.name) {
            return -1;
          }
          return 1;
        case 'apy':
          return  Number(this.vaultFullApy(right.name)) - Number(this.vaultFullApy(left.name));
        case 'tvl':
          return this.vaultTvl(right.name) - this.vaultTvl(left.name);
        case 'users':
          return this.vaultUsers(right.name) - this.vaultUsers(left.name);
        case 'total_earned':
          return this.vaultTotalEarning(right.name) - this.vaultTotalEarning(left.name);
        default:
          break;
      }
    });

    this.sortDirection = !this.sortDirection;
  }

  vaultRewardApyPrettify(tvlName: string): string {
    return Utils.prettifyNumber(this.pricesCalculationService.vaultRewardWeeklyApy(tvlName));
  }

  vaultRewardAprPrettify(tvlName: string): string {
    return Utils.prettifyNumber(this.vaultRewardApr(tvlName));
  }

  vaultRewardApr(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardApr(tvlName);
  }

  vaultFullApy(name: string): string {
    if (name === 'PS') {
      return this.vaultRewardApyPrettify(name);
    }
    if (Utils.isAutoStakeVault(name)) {
      return this.vaultRewardAprPrettify(name);
    }
    return Utils.prettifyNumber(this.vaultApy(name) + this.vaultRewardApy(name));
  }

  vaultApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultApr(tvlName));
  }

  vaultApr(tvlName: string): number {
    return Math.max(this.pricesCalculationService.incomeApr(tvlName), 0);
  }

  vaultRewardApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName));
  }

  vaultTvl(tvlName: string): number {
    return this.pricesCalculationService.tvls.get(tvlName) / 1000000;
  }

  vaultTotalEarning(tvlName: string): number {
    return (this.pricesCalculationService.lastHardWorks.get(tvlName)?.fullRewardUsdTotal * 0.7) || 0;
  }

  vaultUsers(tvlName: string): number {
    return this.pricesCalculationService.lastHarvests.get(tvlName)?.ownerCount || 0;
  }

  openTvlDialog(name: string): void {
    this.tvlModals
    .find(e => e.name === 'tvlModal_' + name)
    ?.open();
  }
}
