import {AfterViewInit, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';
import {NGXLogger} from 'ngx-logger';
import {HarvestDataService} from '@data/services/data/harvest-data.service';
import {assets, Platform, PLATFORM_LIST} from './strategy-list.constants';
import {HardworkDataService} from '@data/services/data/hardwork-data.service';
import {RewardDataService} from '@data/services/data/reward-data.service';
import {PriceDataService} from '@data/services/data/price-data.service';
import {Token} from '@data/models/token';
import {Pool} from '@data/models/pool';
import {VaultsDataService} from '@data/services/vaults-data.service';
import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent extends StrategyListCommonMethods implements AfterViewInit, OnInit, OnDestroy {
  public searchTerm = '';
  public networkFilter = '';
  public platformFilter = '';
  public assetFilter = '';
  // public vaultsList: Contract[] = [];
  public apyWindowState: Record<string, boolean> = {};
  public sortDirection = 'desc';
  public currentSortingValue = 'tvl';
  public vaultsIconsList = [];
  private ngUnsubscribe = new Subject<boolean>();
  @ViewChildren(CustomModalComponent) private tvlModals: QueryList<CustomModalComponent>;

  constructor(
      public vt: ViewTypeService,
      public harvestData: HarvestDataService,
      private contractsService: ContractsService,
      public hardworkData: HardworkDataService,
      public rewardData: RewardDataService,
      public priceData: PriceDataService,
      @Inject(PLATFORM_LIST) public platformList: Array<Platform>,
      private log: NGXLogger,
      private vaultsDataService: VaultsDataService
  ) {
    super(harvestData, hardworkData, rewardData, priceData);
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.poolsList();
    this.additionalVaultsList();
  }

  additionalVaultsList(): void {
      this.vaultsDataService.retrieveVaultsList()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data) => {
              this.vaultsIconsList = data;
          }, err => {
              console.log(err);
          });
  }

  get assetList(): string[] {
    const result = assets;
    this.contractsService.getContractsArray(Token)?.forEach(t => result.add(t.contract.name));
    return Array.from(result.values()).sort((a, b) => a.localeCompare(b));
  }

  get vaultsList(): Vault[] {
    return this.contractsService.getContractsArray(Vault);
  }

  prettyNetwork(name: string): string {
    if (name === 'eth') {
      return 'Ethereum';
    } else if (name === 'bsc') {
      return 'Binance';
    }
    return name;
  }

  poolsList(): Map<string, Pool> {
    return Array.from(this.contractsService.getContracts(Pool).values()).reduce((m, pool) => {
      m.set(pool.lpToken.address, pool);
      return m;
    }, new Map<string, Pool>());
  }

  toggleAPYWindow(address: string): void {
    if (!(address in this.apyWindowState)) {
      this.apyWindowState[address] = true;
      return;
    }
    this.apyWindowState[address] = !this.apyWindowState[address];
  }

  sortVaultsList(sortBy?: string): void {
    this.currentSortingValue = sortBy;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  openTvlDialog(address: string): void {
    this.tvlModals
    .find(e => e.name === 'tvlModal_' + address)
    ?.open();
  }

  isWeeklyRewardActive(vault: Vault): boolean {
    const reward = this.rewardData.getReward(vault?.contract?.address, vault?.contract?.network);
    return !!reward && reward !== 0;
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe.next(true);
      this.ngUnsubscribe.complete();
  }
}
