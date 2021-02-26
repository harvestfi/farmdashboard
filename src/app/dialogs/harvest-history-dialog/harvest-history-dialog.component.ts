import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { StaticValues } from 'src/app/static/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { HarvestDto } from '../../models/harvest-dto';


@Component({
  selector: 'app-harvest-history-dialog',
  templateUrl: './harvest-history-dialog.component.html',
  styleUrls: ['./harvest-history-dialog.component.scss']
})
export class HarvestHistoryDialogComponent implements AfterViewInit {
  vaultFilter = 'all';
  dtos: HarvestDto[] = [];
  harvestTxIds = new Set<string>();
  lowestBlockDate = 999999999999;
  disabled = false;


  constructor(

    private httpService: HttpService,
    public vt: ViewTypeService,
    private log: NGXLogger,
  ) {

  }

  get tvlNames(): string[] {
    return StaticValues.currentVaults;
  }





  ngAfterViewInit(): void {
    this.httpService.getHarvestTxHistoryData().subscribe(data => {

      this.addInArray(data);
    });
  }

  getOlderTransactions(): void {
    this.disabled = true;
    if (this.lowestBlockDate === 0) {
      return;
    }
    this.httpService
      .getHarvestTxHistoryByRange(this.lowestBlockDate - (StaticValues.SECONDS_OF_DAY * 2), this.lowestBlockDate)
      .subscribe(data => {

        this.addInArray(data);
      }).add(() => this.disabled = false);
  }



  private isUniqTx(tx: HarvestDto): boolean {
    if (this.harvestTxIds.has(tx.id)) {
      return false;
    }
    this.harvestTxIds.add(tx.id);
    if (this.harvestTxIds.size > 100_000) {
      this.harvestTxIds = new Set<string>();
    }
    return true;
  }

  private addInArray(newValues: HarvestDto[]): void {

    this.log.info('New values', newValues);
    for (let i = newValues.length - 1; i > 0; i--) {
      const tx = newValues[i];
      if (!this.isUniqTx(tx)) {
        this.log.warn('Not unique transaction', tx);
        continue;
      }
      if (tx.blockDate < this.lowestBlockDate) {
        this.lowestBlockDate = tx.blockDate;
      }
      HarvestDto.enrich(tx);
      this.dtos.push(tx);

    }
  }



}
