import {AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {NGXLogger} from 'ngx-logger';
import {HarvestDataService} from 'src/app/services/data/harvest-data.service';
import {assets, platforms} from './strategy-list.constants';
import {HardworkDataService} from '../../services/data/hardwork-data.service';
import {RewardDataService} from '../../services/data/reward-data.service';
import {PriceDataService} from '../../services/data/price-data.service';
import {Token} from '../../models/token';
import {Pool} from '../../models/pool';
import {map, tap} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {HttpMetricsService} from '../../services/http-metrics.service';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent extends StrategyListCommonMethods implements AfterViewInit, OnInit {
  public searchTerm = '';
  public networkFilter = '';
  public platformFilter = '';
  public assetFilter = '';
  // public vaultsList: Contract[] = [];
  public apyWindowState: Record<string, boolean> = {};
  public sortDirection = 'desc';
  public currentSortingValue = 'tvl';
  public platform_list = platforms;

  @ViewChildren(CustomModalComponent) private tvlModals: QueryList<CustomModalComponent>;

  constructor(
      public vt: ViewTypeService,
      public harvestData: HarvestDataService,
      private contractsService: ContractsService,
      public hardworkData: HardworkDataService,
      public rewardData: RewardDataService,
      public priceData: PriceDataService,
      private log: NGXLogger
  ) {
    super(harvestData, hardworkData, rewardData, priceData);
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    // forkJoin([this.poolsList(), this.vaultsList(), this.assetList()])
    //     .subscribe(([pools, vaults, assets]) => {
    //   this.pools = pools;
    //   this.vaults = vaults;
    //   this.assets = assets;
    //   this.loading = false;
    // });
  };

  get assetList(): Observable<string[]> {
    return this.contractsService.getContracts(Token).pipe(
      map(tokens => Array.from(tokens.keys()).sort((a, b) => b.localeCompare(a))),
    );
  }

  get vaultsList(): Observable<Vault[]> {
    return this.contractsService.getContractsArray(Vault).pipe(
        map(_ => _.filter(v => v.isActive())),
    );
  }

  get poolsList(): Observable<Map<string,Pool>> {
    return this.contractsService.getContractsArray(Pool).pipe(
        map(pools => pools.reduce((m, p) => {
            m.set(p.lpToken.address, p);
            return m;
          }, new Map<string,Pool>())),
    );
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
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  openTvlDialog(name: string): void {
    this.tvlModals
    .find(e => e.name === 'tvlModal_' + name)
    ?.open();
  }
}
