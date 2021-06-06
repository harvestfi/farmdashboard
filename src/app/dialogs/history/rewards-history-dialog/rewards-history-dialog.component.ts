import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {RewardDto} from '../../../models/reward-dto';
import {Utils} from '../../../static/utils';
import {ContractsService} from '../../../services/contracts.service';
import {Vault} from '../../../models/vault';
import {RewardsService} from '../../../services/http/rewards.service';
import { Paginated } from 'src/app/models/paginated';

@Component({
  selector: 'app-rewards-history-dialog',
  templateUrl: './rewards-history-dialog.component.html',
  styleUrls: ['./rewards-history-dialog.component.scss']
})


export class RewardsHistoryDialogComponent implements AfterViewInit {
  @Input() data;
  rewards: Paginated<RewardDto> = Paginated.empty();
  ready = false;
  vaultFilter = '';
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
    this.loadRewardsHistory();
  }

  get vaultNames(): string[] {
    return this.contractsService.getContractsArray(Vault)
    .map(_ => _.contract?.name);
  }


  private loadRewardsHistory(page: number = 0): void {
    this.ready = false;
    this.rewardsService.getPaginatedHistoryRewards(10, page, -1, 'desc', this.vaultFilter).subscribe((response) => {
      this.log.info('Rewards loaded', response);
      if('data' in response) {
        response.data = response.data.filter(r => r.isWeeklyReward)
        .map(RewardDto.fillBlockDateAdopted);

        this.rewards = response;

        this.ready= true;
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
