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

  private hardworkGasCosts = new Map<string, Map<string, number>>(
      Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
  );
  private weeklyProfits = new Map<string, number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));
  private farmBuybacks = new Map<string, number>(Array.from(StaticValues.NETWORKS.keys()).map(name => [name, 0]));

  constructor(private hardworksService: HardworksService, private log: NGXLogger) {
    this.load();
  }

  load(): void {
    this.hardworksService.getAllLastHardWorks().subscribe(data => {
          this.log.info('AllLastHardworks loaded', data);
          return data?.forEach(this.handleHardworks.bind(this));
        }
    );
    this.hardworksService.subscribeToHardworks().subscribe(this.handleHardworks.bind(this));
  }

  private handleHardworks(hardwork: HardWorkDto) {
    this.hardworkGasCosts.get(hardwork.network).set(hardwork.vault, hardwork.savedGasFeesSum || 0);
    this.weeklyProfits.set(hardwork.network, hardwork.weeklyAllProfit / 0.7);
    this.farmBuybacks.set(hardwork.network, hardwork.farmBuybackSum / 1000);
  };

  getHardworkGasCosts(vault: string, network: string): number {
    return this.hardworkGasCosts.get(network).get(vault);
  }

  getTotalGasSaved(network: string): number {
    return Utils.iterableReduce(this.hardworkGasCosts.get(network).values());
  }

  getWeeklyProfits(network: string): number {
    return this.weeklyProfits.get(network);
  }

  getFarmBuybacks(network: string): number {
    return this.farmBuybacks.get(network);
  }
}
