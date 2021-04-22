import {AfterViewInit, Component, QueryList, ViewChildren} from '@angular/core';
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

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent extends StrategyListCommonMethods implements AfterViewInit{
  public searchTerm = '';
  public networkFilter = '';
  public platformFilter = '';
  public assetFilter = '';
  public vaultsList = [];
  public apyWindowState: Record<string, boolean> = {};
  public sortDirection = 'desc';
  public currentSortingValue = 'tvl';
  public platform_list = platforms;
  public asset_list = assets;

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
    this.contractsService.getContracts(Vault).subscribe(vaults => {
      this.vaultsList = vaults.filter(_ => _.isActive()).map(v => v.contract);
      this.log.info('Loaded contracts', this.vaultsList);
    });
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
