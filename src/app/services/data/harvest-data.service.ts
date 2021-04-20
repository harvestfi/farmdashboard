import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HarvestsService} from '../http/harvests.service';
import {StaticValues} from '../../static/static-values';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';
import {VaultStats} from '../../models/vault-stats';

@Injectable({
  providedIn: 'root'
})
export class HarvestDataService {

  private lastGas = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private userCounts = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private poolUsers = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private vaultTvls = new Map<string, Map<string, number>>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );
  private psFarmTvl = 0;
  private farmTotalSupply = 0;
  private lpFarmStaked = 0;
  public lastHarvests = new Map<string, HarvestDto>();
  private latestHarvest: HarvestDto;
  private lastTvlDates = new Map<string, number>();
  public vaultStats = new Map<string, VaultStats>();

  constructor(private harvestsService: HarvestsService, private log: NGXLogger) {
    this.load();
  }

  load() {
    this.harvestsService.getLastTvls().subscribe(harvests => {
          this.log.info('Last TVLs loaded', harvests);
          return harvests?.sort((a, b) => a.block > b.block ? 1 : -1)
          ?.forEach(this.handleHarvest.bind(this));
        }
    );
    this.harvestsService.subscribeToHarvests().subscribe(this.handleHarvest.bind(this));
  }

  private handleHarvest(harvest: HarvestDto) {
    HarvestDto.enrich(harvest);
    if (!this.latestHarvest || this.latestHarvest.blockDate < harvest.blockDate) {
      this.latestHarvest = harvest;
    }
    if (!harvest || this.lastTvlDates.get(harvest.vault) > harvest.blockDate) {
      return;
    }
    if (harvest.lastGas.toString() !== 'NaN'
        && harvest.lastGas !== 0) {
      this.lastGas.set(harvest.network, harvest.lastGas);
    }
    const vaultStats = new VaultStats();
    vaultStats.lpStat = harvest.lpStatDto;
    vaultStats.tvl = harvest.lastTvl;
    vaultStats.owners = harvest.ownerCount;
    this.vaultStats.set(harvest.vault, vaultStats);
    this.lastTvlDates.set(harvest.vault, harvest.blockDate);
    this.lastHarvests.set(harvest.vault, harvest);
    this.poolUsers.set(harvest.network, harvest.allPoolsOwnersCount);
    this.userCounts.set(harvest.network, harvest.allOwnersCount);
    this.updateFarmData(harvest);
    this.vaultTvls.get(harvest.network).set(harvest.vault, harvest.lastUsdTvl);
  }

  private updateFarmData(harvest: HarvestDto) {
    if (harvest.vault === 'PS') {
      this.psFarmTvl = harvest.lastTvl;
      this.farmTotalSupply = harvest.sharePrice;
    }
    if (StaticValues.farmPools.findIndex(farmPool => farmPool === harvest.vault) >= 0) {
      this.lpFarmStaked = [1, 2].reduce((prev, i) => {
        if (harvest.lpStatDto[`coin${i}`] === 'FARM') {
          return harvest.lpStatDto[`amount${i}`];
        }
        return prev;
      }, 0.0);
    }
  }


  getLastGas(network: string): number {
    return this.lastGas.get(network);
  }

  getUserCounts(network: string): number {
    return this.userCounts.get(network);
  }

  getPoolUsers(network: string): number {
    return this.poolUsers.get(network);
  }

  getTvlSum(network: string): number {
    return Utils.iterableReduce(this.vaultTvls.get(network)?.values());
  }

  getVaultTvl(vault: string, network: string): number {
    return this.vaultTvls.get(network).get(vault);
  }

  getPsFarmTvl(): number {
    return this.psFarmTvl;
  }

  getFarmTotalSupply(): number {
    return this.farmTotalSupply;
  }

  getLpFarmStaked(): number {
    return this.lpFarmStaked;
  }
}
