import { Component, Inject, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ViewTypeService } from '@data/services/view-type.service';
import { APP_CONFIG, AppConfig } from 'src/app.config';
import { ContractsService } from '@data/services/contracts.service';
import { Vault } from '@data/models/vault';
import { StaticValues } from '@data/static/static-values';
import { takeUntil } from 'rxjs/operators';
import { VaultsDataService } from '@data/services/vaults-data.service';
import { DestroyService } from '@data/services/destroy.service';

@Component({
  selector: 'app-download-historic-data',
  templateUrl: './download-historic-data.component.html',
  styleUrls: ['./download-historic-data.component.scss'],
  providers: [DestroyService],
})
export class DownloadHistoricDataComponent implements OnInit {
  @Input('data') public data;

  sortedVaults: Vault[];
  vaults: Vault[];
  includeInactive = false;
  vaultsIconsList = [];

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    public vt: ViewTypeService,
    private contractsService: ContractsService,
    private vaultsDataService: VaultsDataService,
    private destroy$: DestroyService,
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.additionalVaultsList();
  }

  additionalVaultsList(): void {
    this.vaultsDataService.retrieveVaultsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.vaultsIconsList = data;
      }, err => {
        console.log(err);
      });
  }

  getData(): void {
    this.sortedVaults = this.vaults = this.contractsService.getContractsArray(Vault);
    if (!this.sortedVaults.length) {
      setTimeout(() => {
        this.getData();
      }, 1000);
    } else {
      this.sortData(null);
    }
  }

  sortData(sort: Sort): void {
    if (!sort || !sort.active || sort.direction === '') {
      this.sortedVaults = this.vaults;
      return;
    }

    this.sortedVaults = this.vaults.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a?.contract?.name, b?.contract?.name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getApiEndpoint(network: string): string {
    return Reflect.get(this.config.apiEndpoints, StaticValues.NETWORKS.get(network).ethparserName);
  }
}
