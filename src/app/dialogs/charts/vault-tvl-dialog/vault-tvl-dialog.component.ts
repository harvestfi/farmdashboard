import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ChartGeneralMethodsComponent} from '../../../chart/chart-general-methods.component';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {HardworksService} from '../../../services/http/hardworks.service';
import {TvlsService} from '../../../services/http/tvls.service';
import {ChartBuilder} from '../../../chart/chart-builder';
import {StaticValues} from '../../../static/static-values';
import {Addresses} from '../../../static/addresses';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';

@Component({
  selector: 'app-vault-tvl-dialog',
  templateUrl: './vault-tvl-dialog.component.html',
  styleUrls: ['./vault-tvl-dialog.component.css']
})
export class VaultTvlDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {
  @Input('vault') vault: string;
  @Input('network') networkInput: string;

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
              private contractService: ContractsService,
              private tvlService: TvlsService,) {
    super(cdRef, vt);
  }

  load() {
    if (this.vault === Addresses.ADDRESSES.get('PS')) {
      this.loadDataPs();
    } else {
      this.loadData();
    }
  }

  get vaultName(): string {
    return this.contractService.getContracts(Vault).get(this.vault)?.contract?.name;
  }

  private loadData(): void {
    this.tvlService.getHistoryTvlByVault(this.vault, StaticValues.NETWORKS.get(this.networkInput)).subscribe(data => {
      this.log.debug('History of ' + this.vault + ' TVL loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(3);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastTvl / 1000000);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastOwnersCount);
        chartBuilder.addInData(2, dto.calculateTime, dto.sharePrice);
      });
      this.handleData(chartBuilder, [
        ['TVL M$', 'right', '#0085ff'],
        ['Accounts', '1', '#7e7e7e'],
        ['Share Price', '2', '#efa4a4'],
      ]);
    });
  }

  private loadDataPs(): void {
    this.tvlService.getHistoryTvlByVault(this.vault).subscribe(data => {
      this.log.debug('History of ' + this.vault + ' TVL loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(4);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastTvl / 1000000);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastOwnersCount);
        chartBuilder.addInData(2, dto.calculateTime, dto.sharePrice);
        chartBuilder.addInData(3, dto.calculateTime, (dto.lastTvlNative / dto.sharePrice) * 100);
      });
      this.handleData(chartBuilder, [
        ['TVL M$', 'right', '#0085ff'],
        ['Accounts', '1', '#7e7e7e'],
        ['Total Supply', '2', '#efa4a4'],
        ['Staked', '3', '#409b4a'],
      ]);
    });
  }

}
