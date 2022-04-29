import { Component, Inject, OnInit } from '@angular/core';
import { ViewTypeService } from '@data/services/view-type.service';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import { ContractsService } from '@data/services/contracts.service';
import { Vault } from '@data/models/vault';
import { NGXLogger } from 'ngx-logger';
import { HarvestDataService } from '@data/services/data/harvest-data.service';
import { assets, NETWORKS, Platform, PLATFORM_LIST, TABLE_HEADERS } from './strategy-list.constants';
import { HardworkDataService } from '@data/services/data/hardwork-data.service';
import { RewardDataService } from '@data/services/data/reward-data.service';
import { PriceDataService } from '@data/services/data/price-data.service';
import { Token } from '@data/models/token';
import { Pool } from '@data/models/pool';
import { VaultsDataService } from '@data/services/vaults-data.service';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '@data/services/destroy.service';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss'],
  providers: [DestroyService],
})
export class StrategyListComponent extends StrategyListCommonMethods implements OnInit {
  public searchTerm = '';
  public networkFilter = '';
  public platformFilter = '';
  public assetFilter = '';
  public isShowInactive = true;
  public vaultsList$: Observable<Vault[]>;
  public apyWindowState: Record<string, boolean> = {};
  public sortDirection = 'desc';
  public currentSortingValue = 'tvl';
  public vaultsIconsList = [];
  public NETWORKS = NETWORKS;
  public TABLE_HEADERS = TABLE_HEADERS;
  
  private isModalDragged = false;
  
  constructor(
    public vt: ViewTypeService,
    public harvestData: HarvestDataService,
    private contractsService: ContractsService,
    public hardworkData: HardworkDataService,
    public rewardData: RewardDataService,
    public priceData: PriceDataService,
    @Inject(PLATFORM_LIST) public platformList: Array<Platform>,
    private log: NGXLogger,
    private vaultsDataService: VaultsDataService,
    private destroy$: DestroyService,
  ) {
    super(harvestData, hardworkData, rewardData, priceData);
  }
  
  ngOnInit(): void {
    this.poolsList();
    this.additionalVaultsList();
    this.getVaultsList();
    
    this.vaultsList$ = this.contractsService.getContracts$<Vault>(Vault);
  }
  
  additionalVaultsList(): void {
    this.vaultsDataService.retrieveVaultsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
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
  
  getVaultsList(): void {
    this.contractsService.getContracts(Vault);
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
    if (this.isModalDragged) {
      return;
    }
    
    if (!(address in this.apyWindowState)) {
      this.apyWindowState[address] = true;
      return;
    }
    this.apyWindowState[address] = !this.apyWindowState[address];
  }
  
  closeAPYWindow(address: string): void {
    this.apyWindowState[address] = false;
    this.isModalDragged = false;
  }
  
  sortVaultsList(sortBy?: string): void {
    if (!sortBy) {
      return;
    }
    
    this.currentSortingValue = sortBy;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
  
  isWeeklyRewardActive(vault: Vault): boolean {
    const reward = this.rewardData.getReward(vault?.contract?.address, vault?.contract?.network);
    return !!reward && reward !== 0;
  }
  
  onModalDrag(isDragged: boolean): void {
    this.isModalDragged = isDragged;
  }
}
