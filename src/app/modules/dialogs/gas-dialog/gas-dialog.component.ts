import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { StaticValues } from '@data/static/static-values';
import { ViewTypeService } from '@data/services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { ChartBuilder } from '../../chart/chart-builder';
import { ChartGeneralMethodsComponent } from '@modules/chart/chart-general-methods.component';
import { HarvestsService } from '@data/services/http/harvests.service';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-gas-dialog',
  templateUrl: './gas-dialog.component.html',
  styleUrls: ['./gas-dialog.component.css'],
  providers: [DestroyService],
})
export class GasDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(
    private harvestsService: HarvestsService,
    public vt: ViewTypeService,
    public cdRef: ChangeDetectorRef,
    protected destroy$: DestroyService,
    private log: NGXLogger,
  ) {
    super(cdRef, vt, destroy$);
  }

  load(): void {
    const currentDate = Math.ceil(new Date().getTime() / 1000);
    this.harvestsService.getHarvestTxHistoryByRange(
      currentDate - StaticValues.SECONDS_OF_MONTH,
      currentDate, StaticValues.NETWORKS.get(this.network),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.log.debug('Gas price history ', data);
        const chartBuilder = new ChartBuilder();
        let prevDate = 0;
        chartBuilder.initVariables(1);
        data?.forEach(dto => {
          if (prevDate !== dto.blockDate) {
            chartBuilder.addInData(0, dto.blockDate, dto.lastGas);
          }
          prevDate = dto.blockDate;
        });
        this.handleData(chartBuilder, [
          ['Gas price', 'right', '#5CADAA'],
        ]);
      });
  }
}
