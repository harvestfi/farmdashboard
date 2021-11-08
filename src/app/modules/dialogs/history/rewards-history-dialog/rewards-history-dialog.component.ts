import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from '@data/models/reward-dto';
import {Utils} from '@data/static/utils';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';
import {RewardsService} from '@data/services/http/rewards.service';
import { Paginated } from '@data/models/paginated';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rewards-history-dialog',
  templateUrl: './rewards-history-dialog.component.html',
  styleUrls: ['./rewards-history-dialog.component.scss'],
  providers: [DestroyService],
})

export class RewardsHistoryDialogComponent implements AfterViewInit {
  @Input() data;
  rewards: Paginated<RewardDto> = Paginated.empty();
  ready = false;
  vaultFilter = '';
  startDate: Date;
  endDate: Date;

  constructor(
    public vt: ViewTypeService,
    private cdRef: ChangeDetectorRef,
    private log: NGXLogger,
    private contractsService: ContractsService,
    private rewardsService: RewardsService,
    private destroy$: DestroyService,
  ) {
  }

  ngAfterViewInit(): void {
    this.loadRewardsHistory();
  }

  get vaultNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
    .map(_ => _.contract?.name);
  }

  private loadRewardsHistory(page: number = 0): void {
    this.ready = false;
    this.rewardsService.getPaginatedHistoryRewards(10, page, -1, 'desc', this.vaultFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.log.info('Rewards loaded', response);
        if ('data' in response) {
          response.data = response.data.filter(r => r.isWeeklyReward)
            .map(RewardDto.fillBlockDateAdopted);

          this.rewards = response;

          this.ready = true;
          this.cdRef.detectChanges();
          return;
        }

        this.rewards = Paginated.empty();
      });
  }


  handlePageChange($event): void {
    this.loadRewardsHistory($event);
  }

  handleFilterUpdate(): void {
    this.loadRewardsHistory(0);
  }

  openNetworkScanTx(hash: string, network: string): void {
    return Utils.openNetworkScanTx(hash, network);
  }

  getVault(address: string): Vault {
    return this.contractsService.getContracts(Vault).get(address);
  }

}
