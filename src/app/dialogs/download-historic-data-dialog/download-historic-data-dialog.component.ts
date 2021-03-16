import {Component, OnInit} from '@angular/core';
import {StaticValues} from '../../static/static-values';
import {Sort} from '@angular/material/sort';
import {environment} from '../../../environments/environment';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-download-historic-data-dialog',
  templateUrl: './download-historic-data-dialog.component.html',
  styleUrls: ['./download-historic-data-dialog.component.scss']
})
export class DownloadHistoricDataDialogComponent implements OnInit {
  sortedVaults: string[];
  includeInactive = false;
  apiEndpoint = '';

  constructor(public vt: ViewTypeService) {
    this.sortedVaults = StaticValues.vaults;
    this.sortData(null);
    this.apiEndpoint = environment.apiEndpoint;
  }

  ngOnInit(): void {
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
        default:
          return 0;
      }
    });
  }

  tvlPrettyName(tvlName: string): string {
    return tvlName?.replace('SUSHI_', '');
  }

  getImgSrc(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
