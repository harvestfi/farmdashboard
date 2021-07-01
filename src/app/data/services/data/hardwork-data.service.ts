import {Injectable} from '@angular/core';
import {HardworksService} from '../http/hardworks.service';
import {NGXLogger} from 'ngx-logger';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {StaticValues} from '@data/static/static-values';
import {Utils} from '@data/static/utils';

@Injectable({
  providedIn: 'root'
})
export class HardworkDataService {

  private dtos: HardWorkDto[] = [];
  private lastHardworks = new Map<string, Map<string, HardWorkDto>>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );

  private latestHardwork = new Map<string, HardWorkDto>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, null])
  );

  private handledIds = new Set<string>();

  constructor(private hardworksService: HardworksService, private log: NGXLogger) {
    this.load();
  }

  private load(): void {

    this.hardworksService.getLastHardWorks(100).subscribe(data => {
      this.log.debug('Last page with hardwork loaded', data);
      return data.sort((a, b) => a.block > b.block ? 1 : -1)
      ?.forEach(this.handleHardworks.bind(this));
    }).add(() => {
      this.hardworksService.getAllLastHardWorks().subscribe(data => {
            this.log.debug('AllLastHardworks loaded', data);
            return data?.forEach(this.handleHardworks.bind(this));
          }
      );
    });
    this.hardworksService.subscribeToHardworks().subscribe(this.handleHardworks.bind(this));
  }

  private handleHardworks(dto: HardWorkDto): void {
    if (!dto) {
      return;
    }
    HardWorkDto.enrich(dto);
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
    if (!this.latestHardwork.get(dto.network)
        || this.latestHardwork.get(dto.network).blockDate < dto.blockDate) {
      this.latestHardwork.set(dto.network, dto);
    }
    Utils.addInArrayAtTheStart(this.dtos, dto);
    this.dtos = this.dtos.sort((a, b) => b.blockDate - a.blockDate);
    this.lastHardworks.get(dto.network)?.set(dto.vaultAddress, dto);
    this.handledIds.add(dto.id);
  }

  private isNotActual(dto: HardWorkDto): boolean {
    return !dto
        || this.lastHardworks.get(dto.network)?.get(dto.vaultAddress)?.blockDate > dto.blockDate;
  }

  getLastHardWork(address: string, network: string): HardWorkDto {
    return this.lastHardworks.get(network)?.get(address);
  }

  getLatestHardWork(network: string): HardWorkDto {
    return this.latestHardwork.get(network);
  }

  getTotalGasSaved(network: string): number {
    return Utils.iterableReduce(this.lastHardworks.get(network).values(), a => a.savedGasFeesSum);
  }

  getWeeklyProfits(network: string): number {
    return this.latestHardwork.get(network)?.weeklyAllProfit;
  }

  getWeeklyApr(address: string, network: string): number {
    const hardWork = this.lastHardworks.get(network).get(address);
    if (!hardWork) {
      return 0;
    }
    if ((Date.now() / 1000) - hardWork.blockDate > (StaticValues.SECONDS_OF_DAY * 14)) {
      // this.log.warn('old hw for ' + tvlName);
      return 0;
    }
    let avgTvl = hardWork?.weeklyAverageTvl;
    if (!avgTvl || avgTvl === 0) {
      avgTvl = hardWork?.tvl;
    }
    const weeklyProfit = Math.max(hardWork.weeklyProfit, 0);
    return (StaticValues.SECONDS_OF_YEAR / StaticValues.SECONDS_OF_WEEK)
        * ((weeklyProfit / avgTvl) * 100.0);
  }

  getRoiBasedOnPPFS(address: string, network: string): number {
    const hardWork = this.lastHardworks.get(network).get(address);
    if (!hardWork) {
      return 0;
    }
    return (hardWork.shareChange / hardWork.idleTime) * 100 * StaticValues.SECONDS_OF_YEAR;
  }

  getIdleTime(address: string, network: string): number {
    return this.lastHardworks.get(network)?.get(address)?.idleTime / 60 / 60;
  }

  getDtos(): HardWorkDto[] {
    return this.dtos;
  }
}
