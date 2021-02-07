import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {WebsocketService} from '../../../services/websocket.service';
import {HttpService} from '../../../services/http.service';
import {NGXLogger} from 'ngx-logger';
import {HarvestDto} from '../../../models/harvest-dto';
import {WsConsumer} from '../../../services/ws-consumer';
import {PricesCalculationService} from '../../../services/prices-calculation.service';
import {StaticValues} from '../../../static/static-values';
import {ViewTypeService} from '../../../services/view-type.service';
import {SnackService} from '../../../services/snack.service';
import {HardWorkDto} from '../../../models/hardwork-dto';
import {RewardDto} from '../../../models/reward-dto';
import {HarvestHistoryDialogComponent} from '../../../dialogs/harvest-history-dialog/harvest-history-dialog.component';
import {PriceSubscriberService} from '../../../services/price-subscriber.service';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';

@Component({
  selector: 'app-harvest-tx',
  templateUrl: './harvest-tx.component.html',
  styleUrls: ['./harvest-tx.component.css']
})
export class HarvestTxComponent implements AfterViewInit, WsConsumer {
  dtos: HarvestDto[] = [];
  subscribed = false;
  txIds = new Set<string>();
  vaultFilter = 'all';
  private maxMessages = 50;
  @ViewChild('harvestHistoryModal') private harvestHistoryModal: CustomModalComponent;

  constructor(private ws: WebsocketService,
              private httpService: HttpService,
              private cdRef: ChangeDetectorRef,
              private pricesCalculationService: PricesCalculationService,
              public vt: ViewTypeService,
              private priceSubscriberService: PriceSubscriberService,
              private snack: SnackService,
              private log: NGXLogger,
  ) {
  }

  get tvlNames(): string[] {
    return StaticValues.currentVaults;
  }

  setSubscribed(s: boolean): void {
    this.subscribed = s;
  }

  isSubscribed(): boolean {
    return this.subscribed;
  }

  ngAfterViewInit(): void {
    this.loadLastPrices(
        () => this.loadLastHarwests(() => this.loadLastTvls(() => {
          this.loadLastHardWorks();
          this.loadLastRewards();
        }))
    );

    this.initWs();
    this.priceSubscriberService.initWs();
  }

  public initWs(): void {
    if (this.ws.registerConsumer(this) && !this.subscribed) {
      this.subscribeToTopic();
    }
  }

  public subscribeToTopic(): void {
    this.log.info('Harvest Subscribe on topic');
    this.subscribed = true;
    this.ws.onMessage('/topic/harvest', (m => HarvestDto.fromJson(m.body)))
    ?.subscribe(tx => {
      try {
        this.log.debug('harvest tx', tx);
        if (tx.methodName === 'price_stub') {
          this.handlePriceTx(tx);
          return;
        }
        this.snack.openSnack(tx.print());
        if (!this.isUniqTx(tx)) {
          this.log.error('Not unique', tx);
          return;
        }
        this.addInArray(this.dtos, tx);
        this.pricesCalculationService.updateTvls();
      } catch (e) {
        this.log.error('Error harvest', e, tx);
      }
    });
    this.ws.onMessage('/topic/rewards', (m => RewardDto.fromJson(m.body)))
    ?.subscribe(tx => {
      try {
        this.log.debug('Reward tx', tx);
        this.pricesCalculationService.saveReward(tx);
      } catch (e) {
        this.log.error('Error harvest', e, tx);
      }
    });
  }

  private loadLastHarwests(next: () => void): void {
    this.httpService.getHarvestTxHistoryData().subscribe(data => {
      this.log.debug('harvest data fetched', data);
      data?.forEach(tx => {
        HarvestDto.enrich(tx);
        this.addInArray(this.dtos, tx);
      });
      next();
    });
  }

  private loadLastTvls(next: () => void): void {
    this.httpService.getLastTvls().subscribe(data => {
      this.log.debug('Loaded last tvls ', data);
      data?.forEach(tvl => {
        HarvestDto.enrich(tvl);
        this.pricesCalculationService.writeFromHarvestTx(tvl);
      });

      this.log.debug('All tvl values loaded');
      this.pricesCalculationService.updateTvls();
      next();
    });
  }

  private loadLastHardWorks(): void {
    this.httpService.getLastHardWorks().subscribe(data => {
      data?.forEach(hardWork => {
        // if (!StaticValues.currentVaults.find((p) => p === hardWork.vault)) {
        //   return;
        // }
        HardWorkDto.enrich(hardWork);
        this.pricesCalculationService.saveHardWork(hardWork);
      });
      this.log.debug('Loaded last hardworks ', data, this.pricesCalculationService.lastHardWorks);
    });
  }

  private loadLastRewards(): void {
    this.httpService.getLastRewards().subscribe(data => {
      data?.forEach(reward => {
        RewardDto.enrich(reward);
        this.pricesCalculationService.saveReward(reward);
      });
      this.log.debug('Loaded last rewards ', data);
    });
  }

  private loadLastPrices(next: () => void): void {
    this.httpService.getLastPrices().subscribe(data => {
      data?.forEach(tx => {
        this.pricesCalculationService.savePrice(tx);
      });
      this.log.debug('Loaded last prices ', data);
      next();
    });
  }

  private isUniqTx(tx: HarvestDto): boolean {
    if (this.txIds.has(tx.id)) {
      return false;
    }
    this.txIds.add(tx.id);
    if (this.txIds.size > 100_000) {
      this.txIds = new Set<string>();
    }
    return true;
  }

  private addInArray(arr: HarvestDto[], tx: HarvestDto): void {
    this.pricesCalculationService.writeFromHarvestTx(tx);
    arr.unshift(tx);
    if (arr.length > this.maxMessages) {
      arr.pop();
    }
  }

  private handlePriceTx(dto: HarvestDto): void {
    this.pricesCalculationService.updateTvls();
    if (dto.lastGas != null && (dto.lastGas + '') !== 'NaN' && dto.lastGas !== 0) {
      StaticValues.lastGas = dto.lastGas;
    }
  }

  openHarvestHistory(): void {
    this.harvestHistoryModal.open();
  }
}
