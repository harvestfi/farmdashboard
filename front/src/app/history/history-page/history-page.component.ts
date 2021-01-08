import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../utils';
import {NGXLogger} from 'ngx-logger';
import {StaticValues} from '../../static-values';
import {TransferDto} from '../../models/transfer-dto';

class CheckedValue {
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  fullData = [];
  sortedData: any[];
  includeTransfers: boolean;
  vaults: CheckedValue[] = [];
  address: string;
  inputAddress: string;

  lastTransfer: TransferDto;
  lastStaked = new Map<string, HarvestDto>();

  constructor(private http: HttpService,
              private route: ActivatedRoute,
              private log: NGXLogger) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clear();
      this.address = params.address;
      this.inputAddress = params.address;
      this.http.getAddressHistoryHarvest(this.address).subscribe(harvests => {
            this.log.info('Load harvest history', harvests);
            harvests?.forEach(harvest => {
              HarvestDto.enrich(harvest);
              this.fullData.push(harvest);
            });

            this.http.getAddressHistoryTransfers(this.address).subscribe(transfers => {
              this.log.info('Load transfers history', transfers);
              transfers?.forEach(transfer => {
                TransferDto.enrich(transfer);
                this.fullData.push(transfer);
              });

              this.sortValues();
              this.parseValues();
            });
          }
      );
    });
  }

  clear(): void {
    this.fullData = [];
    this.sortedData = null;
    this.includeTransfers = false;
    this.vaults = [];
    this.address = null;
    this.inputAddress = null;
    this.lastTransfer = null;
    this.lastStaked = new Map<string, HarvestDto>();
  }

  sortValues(): void {
    this.sortedData = [];
    this.fullData.forEach(record => {
      if (Utils.isHarvest(record) && this.includeIn(this.vaults, record.vault)) {
        this.sortedData.push(record);
      } else if (Utils.isTransfer(record) && this.includeTransfers) {
        if (record.type === 'PS_EXIT' || record.type === 'PS_STAKE') {
          return;
        }
        this.sortedData.push(record);
      }
    });
    this.sortedData.sort((o1, o2) => o2.blockDate - o1.blockDate);
  }

  includeIn(arr: CheckedValue[], name: string): boolean {
    const c = arr.find(el => el.value === name);
    if (c) {
      return c.checked;
    }
    return false;
  }

  parseValues(): void {
    this.fullData.sort((o1, o2) => o1.blockDate - o2.blockDate)
    .forEach(record => {
      if (Utils.isHarvest(record)) {
        this.parseHarvest(record);
      } else if (Utils.isTransfer(record)) {
        this.parseTransfer(record);
      } else {
        this.log.warn('Unknown record type', record);
      }
    });
  }

  summary(): number {
    let summary = 0;
    if (this.lastTransfer) {
      summary = this.transferBalanceUsd(this.lastTransfer);
    }
    this.lastStaked?.forEach(harvest => {
      summary += harvest.ownerBalanceUsd;
    });
    return summary;
  }

  transferBalanceUsd(t: TransferDto): number {
    return Utils.transferBalanceUsd(t, this.address);
  }

  prettyVaultName(name: string): string {
    return StaticValues.vaultPrettyName(name);
  }

  isPositive(record: any): boolean {
    return Utils.isHarvestPositive(record) || Utils.isUniPositive(record);
  }

  isHarvest(record: any): boolean {
    return Utils.isHarvest(record);
  }

  isTransfer(record: any): boolean {
    return Utils.isTransfer(record);
  }

  getImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  private parseHarvest(record: HarvestDto): void {
    const harvest = this.lastStaked.get(record.vault);
    this.addInCheckedArr(this.vaults, record.vault);
    if (harvest) {
      if (harvest.blockDate < record.blockDate) {
        this.lastStaked.set(record.vault, record);
      }
    } else {
      this.lastStaked.set(record.vault, record);
    }
  }

  private parseTransfer(record: TransferDto): void {
    if (this.lastTransfer) {
      if (this.lastTransfer.blockDate < record.blockDate) {
        this.lastTransfer = record;
      }
    } else {
      this.lastTransfer = record;
    }
  }

  private addInCheckedArr(arr: CheckedValue[], name: string): void {
    if (arr.find(el => el.value === name)) {
      return;
    }
    const c = new CheckedValue();
    c.value = name;
    c.checked = false;
    arr.push(c);
  }
}
