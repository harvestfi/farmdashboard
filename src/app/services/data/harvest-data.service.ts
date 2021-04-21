import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HarvestsService} from '../http/harvests.service';
import {StaticValues} from '../../static/static-values';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';

@Injectable({
  providedIn: 'root'
})
export class HarvestDataService {

  private dtos: HarvestDto[] = [];
  private lastGas = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private allUsersQuantity = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private allVaultsUsers = new Map<string, number>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0])
  );
  private farmTotalSupply = 0;
  private lpFarmStaked = 0;
  private lastHarvests = new Map<string, Map<string, HarvestDto>>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );
  private latestHarvest = new Map<string, HarvestDto>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, null])
  );

  constructor(private harvestsService: HarvestsService, private log: NGXLogger) {
    this.load();
  }

  private load() {
    this.harvestsService.getLastTvls().subscribe(harvests => {
          this.log.info('Last TVLs loaded', harvests);
          return harvests?.sort((a, b) => a.block > b.block ? 1 : -1)
          ?.forEach(this.handleHarvest.bind(this));
        }
    );
    this.harvestsService.subscribeToHarvests().subscribe(this.handleHarvest.bind(this));
  }

  private handleHarvest(dto: HarvestDto) {
    HarvestDto.enrich(dto);
    if (!dto.network || dto.network === '') {
      this.log.warn('Empty network', dto);
      return;
    }
    if (this.isNotActual(dto)) {
      this.log.warn('Old vault info', dto);
      return;
    }
    if (!this.latestHarvest.get(dto.network)
        || this.latestHarvest.get(dto.network).blockDate < dto.blockDate) {
      this.latestHarvest.set(dto.network, dto);
    }
    Utils.addInArrayAtTheStart(this.dtos, dto);
    Utils.addInMap(this.lastGas, dto.network, dto.lastGas);
    Utils.addInMap(this.allVaultsUsers, dto.network, dto.allPoolsOwnersCount);
    Utils.addInMap(this.allUsersQuantity, dto.network, dto.allOwnersCount);
    this.lastHarvests.get(dto.network)?.set(dto.vault, dto);
    this.updateFarmData(dto);
    if (dto.vault === 'PS') {
      this.log.info('PS loaded', this.lastHarvests.get(dto.network)?.get(dto.vault), dto);
    }
  }

  private isNotActual(dto: HarvestDto): boolean {
    return !dto
        || this.lastHarvests.get(dto.network)?.get(dto.vault)?.blockDate > dto.blockDate;
  }

  private updateFarmData(harvest: HarvestDto) {
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
    return this.allUsersQuantity.get(network);
  }

  getAllVaultsUsers(network: string): number {
    return this.allVaultsUsers.get(network);
  }

  getTvlSum(network: string): number {
    return Utils.iterableReduce(this.lastHarvests.get(network)?.values(), a => a.lastUsdTvl);
  }

  getVaultTvl(vault: string, network: string): number {
    return this.lastHarvests.get(network)?.get(vault)?.lastUsdTvl;
  }

  getFarmTotalSupply(): number {
    return this.farmTotalSupply;
  }

  getLpFarmStaked(): number {
    return this.lpFarmStaked;
  }

  getVaultLastInfo(name: string, network: string): HarvestDto {
    return this.lastHarvests.get(network)?.get(name);
  }

  getDtos(): HarvestDto[] {
    return this.dtos;
  }
}
