import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from '../../../models/reward-dto';
import {Utils} from '../../../static/utils';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';
import {RewardsService} from '../../../services/http/rewards.service';

@Component({
  selector: 'app-rewards-history-dialog',
  templateUrl: './rewards-history-dialog.component.html',
  styleUrls: ['./rewards-history-dialog.component.css']
})

export class RewardsHistoryDialogComponent implements AfterViewInit {
  @Input() data;
  rewards: Array<RewardDto> = [];
  ready = false;
  disabled = false;
  vaultFilter = '-';
  startDate: Date;
  endDate: Date;

  private dayLag = 15;

  constructor(public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private contractsService: ContractsService,
              private rewardsService: RewardsService,
  ) {
  }

  ngAfterViewInit(): void {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 1);

    this.startDate.setDate(this.startDate.getDate() - this.dayLag);
    this.loadRewardsHistory();
  }

  get vaultNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
    .map(_ => _.contract?.name);
  }


  private loadRewardsHistory(): void {
    this.rewardsService.getAllHistoryRewards(
        Math.floor(this.startDate.getTime() / 1000),
        Math.floor(this.endDate.getTime() / 1000))
    .subscribe((data) => {
      this.log.info('Rewards loaded', data);
      this.rewards.push(...(data
      .filter(r => r.isWeeklyReward)
      .map(RewardDto.fillBlockDateAdopted)
      .reverse()));
      this.ready = true;
      this.disabled = false;
      this.cdRef.detectChanges();
    });
  }

  loadMoreRewardsHistory(): void {
    this.disabled = true;
    this.endDate.setDate(this.startDate.getDate());
    this.startDate.setDate(this.endDate.getDate() - this.dayLag);
    this.loadRewardsHistory();
  }

  openNetworkScanTx(hash: string, network: string): void {
    return Utils.openNetworkScanTx(hash, network);
  }

  getVault(address: string): Vault {
    return this.contractsService.getContracts(Vault).get(address);
  }

}
