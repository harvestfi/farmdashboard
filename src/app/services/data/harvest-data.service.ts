import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HarvestsService} from '../http/harvests.service';
import {StaticValues} from '../../static/static-values';
import {HarvestDto} from '../../models/harvest-dto';
import {Utils} from '../../static/utils';
import {PriceDataService} from './price-data.service';
import {LpStat} from '../../models/lp-stat';
import {ContractsService} from '../contracts.service';
import {Vault} from '../../models/vault';
import {Token} from '../../models/token';
import {Addresses} from '../../static/addresses';

@Injectable({
  providedIn: 'root'
})
export class HarvestDataService {
  private static excludeFromTotalTvl = new Set([Addresses.ADDRESSES.get('iPS')]);
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
  private handledIds = new Set<string>();

  constructor(
      private harvestsService: HarvestsService,
      private contractService: ContractsService,
      private log: NGXLogger
  ) {
    this.load();
  }

  private load() {
    this.harvestsService.getHarvestTxHistoryData().subscribe(harvests => {
          this.log.info('Last 100 vault actions loaded', harvests);
          return harvests?.sort((a, b) => a.block > b.block ? 1 : -1)
          ?.forEach(this.handleHarvest.bind(this));
        }
    ).add(() => {
      this.harvestsService.getLastTvls().subscribe(harvests => {
            this.log.info('Last Vault Actions loaded', harvests);
            return harvests?.sort((a, b) => a.block > b.block ? 1 : -1)
            ?.forEach(this.handleHarvest.bind(this));
          }
      );
    });

    this.harvestsService.subscribeToHarvests().subscribe(this.handleHarvest.bind(this));
  }

  private handleHarvest(dto: HarvestDto) {
    HarvestDto.enrich(dto);
    if (this.handledIds.has(dto.id)) {
      // this.log.warn('Duplicate record', dto);
      return;
    }
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
    this.dtos = this.dtos.sort((a,b) => b.blockDate - a.blockDate);
    Utils.addInMap(this.lastGas, dto.network, dto.lastGas);
    Utils.addInMap(this.allVaultsUsers, dto.network, dto.allPoolsOwnersCount);
    Utils.addInMap(this.allUsersQuantity, dto.network, dto.allOwnersCount);
    this.lastHarvests.get(dto.network)?.set(dto.vaultAddress, dto);
    this.updateFarmData(dto);
    if (dto.vaultAddress === Addresses.ADDRESSES.get('PS')) {
      this.log.info('PS loaded', this.lastHarvests.get(dto.network)?.get(dto.vaultAddress), dto);
    }
    // this.log.debug('Handled vault action', dto, this.dtos);
    this.handledIds.add(dto.id);
  }

  private isNotActual(dto: HarvestDto): boolean {
    return !dto
        || this.lastHarvests.get(dto.network)?.get(dto.vaultAddress)?.blockDate > dto.blockDate;
  }

  private updateFarmData(harvest: HarvestDto) {
    if (StaticValues.farmPools.findIndex(farmPool => farmPool === harvest.vaultAddress) >= 0) {
      this.lpFarmStaked = [1, 2].reduce((prev, i) => {
        if (harvest.lpStatDto[`coin${i}Address`] === Addresses.ADDRESSES.get('FARM')) {
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

  getTvlSum(network: string, priceData: PriceDataService): number {
    let sum = 0;
    for (const dto of this.lastHarvests.get(network)?.values()) {
      if (HarvestDataService.excludeFromTotalTvl.has(dto.vaultAddress)) {
        continue;
      }
      sum += this.getVaultTvl(dto.vaultAddress, network, priceData);
    }
    return sum;
  }

  getVaultTvl(vaultAddress: string, network: string, priceData: PriceDataService): number {
    const dto = this.lastHarvests.get(network)?.get(vaultAddress);
    if (!dto) {
      return 0;
    }
    return this.calculateTvl(dto, priceData);
  }

  getFarmTotalSupply(): number {
    return this.farmTotalSupply;
  }

  getLpFarmStaked(): number {
    return this.lpFarmStaked;
  }

  getVaultLastInfo(address: string, network: string): HarvestDto {
    return this.lastHarvests.get(network)?.get(address);
  }

  getDtos(): HarvestDto[] {
    return this.dtos;
  }

  // TODO create normal price resolving!
  private calculateTvl(dto: HarvestDto, priceData: PriceDataService): number {
    if (dto.lpStatDto) {
      const tvl = this.calculateTvlForLp(dto.lpStatDto, priceData, dto.network);
      if (tvl === 0) {
        // this.log.warn('zero tvl', dto.vault);
        return dto.lastUsdTvl;
      }
      return tvl;
    } else if (dto.lastTvl) {
      const vaultContract = this.contractService.getContracts(Vault).get(dto.vaultAddress);
      if(!vaultContract) {
        return dto.lastUsdTvl;
      }
      let underlyingAddress = vaultContract?.underlying?.address;
      const curveUnderlying = this.getCurveUnderlying(underlyingAddress);
      if (curveUnderlying) {
        underlyingAddress = curveUnderlying;
      }
      const price = priceData.getUsdPrice(underlyingAddress, dto.network);
      if (price === 0) {
        // this.log.warn('zero tvl', dto.vault);
        return dto.lastUsdTvl;
      }
      const tvl = dto.lastTvl * price;
      if (tvl === Infinity) {
        return 0;
      }
      return tvl;
    }
    return 0.0;
  }

  private getCurveUnderlying(address: string): string {
    const tokenContract = this.contractService.getContracts(Token).get(address);
    return tokenContract?.curveUnderlying;
  }

  private calculateTvlForLp(lpStat: LpStat, priceData: PriceDataService, network: string): number {
    const price1 = priceData.getUsdPrice(lpStat.coin1Address, network);
    const price2 = priceData.getUsdPrice(lpStat.coin2Address, network);
    const amount1 = price1 * lpStat.amount1;
    const amount2 = price2 * lpStat.amount2;
    return amount1 + amount2;
  }
}
