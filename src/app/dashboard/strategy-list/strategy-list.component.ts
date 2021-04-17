import {AfterViewInit, Component, QueryList, ViewChildren} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {PricesCalculationService} from 'src/app/services/prices-calculation.service';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';
import StrategyListCommonMethods from './strategy-list-common-methods.utility';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {NGXLogger} from 'ngx-logger';

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
  // Mutating the currentVaults in static values before using it so that we
  // are able to sort this array and not get a new one from the service.
  public vaultsList = [];
  public apyWindowState: Record<string, boolean> = {};
  // false = desc, true = asc
  public sortDirection = 'desc';
  public currentSortingValue = 'tvl';

  @ViewChildren(CustomModalComponent) private tvlModals: QueryList<CustomModalComponent>;

  constructor(
      public vt: ViewTypeService,
      public pricesCalculationService: PricesCalculationService,
      private contractsService: ContractsService,
      private log: NGXLogger
  ) {
    super(pricesCalculationService);
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
