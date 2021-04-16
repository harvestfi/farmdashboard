import {Component, Inject, OnInit} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {ViewTypeService} from '../../services/view-type.service';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {ContractsService} from '../../services/contracts.service';
import {Vault} from '../../models/vault';
import {StaticValues} from '../../static/static-values';
import get = Reflect.get;

@Component({
  selector: 'app-download-historic-data-dialog',
  templateUrl: './download-historic-data-dialog.component.html',
  styleUrls: ['./download-historic-data-dialog.component.scss']
})
export class DownloadHistoricDataDialogComponent implements OnInit {
  sortedVaults: Vault[];
  vaults: Vault[];
  includeInactive = false;

  constructor(
      @Inject(APP_CONFIG) public config: AppConfig,
      public vt: ViewTypeService,
      private contractsService: ContractsService
  ) {
  }

  ngOnInit(): void {
    this.contractsService.getContracts(Vault).subscribe(vaults => {
      this.sortedVaults = this.vaults = vaults;
      this.sortData(null);
    });
  }

  sortData(sort: Sort): void {
    let vaults;
    if (this.includeInactive) {
      vaults = this.vaults;
    } else {
      vaults = this.vaults.filter(_ => _.isActive());
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
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getApiEndpoint(network: string): string {
    return get(this.config.apiEndpoints, StaticValues.NETWORKS.get(network).ethparserName);
  }
}
