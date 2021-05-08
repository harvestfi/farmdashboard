import {Injectable} from '@angular/core';
import {HardworksService} from '../http/hardworks.service';
import {NGXLogger} from 'ngx-logger';
import {HardWorkDto} from '../../models/hardwork-dto';
import {StaticValues} from '../../static/static-values';
import {Utils} from '../../static/utils';

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

  constructor(private hardworksService: HardworksService, private log: NGXLogger) {
    this.load();
  }

  private load(): void {

    this.hardworksService.getLastHardWorks(100).subscribe(data => {
      this.log.info('Last page with hardwork loaded', data);
      return data.sort((a, b) => a.block > b.block ? 1 : -1)
      ?.forEach(this.handleHardworks.bind(this));
    }).add(() => {
      this.hardworksService.getAllLastHardWorks().subscribe(data => {
            this.log.info('AllLastHardworks loaded', data);
            return data?.forEach(this.handleHardworks.bind(this));
          }
      );
    });
    this.hardworksService.subscribeToHardworks().subscribe(this.handleHardworks.bind(this));
  }

  private handleHardworks(dto: HardWorkDto) {
    if (!dto) {
      return;
    }
    HardWorkDto.enrich(dto);
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
    this.dtos = this.dtos.sort((a,b) => b.blockDate - a.blockDate);
    this.lastHardworks.get(dto.network)?.set(dto.vault, dto);
  };

  private isNotActual(dto: HardWorkDto): boolean {
    return !dto
        || this.lastHardworks.get(dto.network)?.get(dto.vault)?.blockDate > dto.blockDate;
  }

  getLastHardWork(name: string, network: string): HardWorkDto {
    return this.lastHardworks.get(network)?.get(name);
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

  getWeeklyApr(name: string, network: string): number {
    const hardWork = this.lastHardworks.get(network).get(name);
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

  getDtos(): HardWorkDto[] {
    return this.dtos;
  }
}
