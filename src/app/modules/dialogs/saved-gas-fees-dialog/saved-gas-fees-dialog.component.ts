import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { HttpService } from '@data/services/http/http.service';
import { ViewTypeService } from '@data/services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { ChartBuilder } from '../../chart/chart-builder';
import { ChartGeneralMethodsComponent } from '@modules/chart/chart-general-methods.component';
import { HardworksService } from '@data/services/http/hardworks.service';
import { StaticValues } from '@data/static/static-values';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-saved-gas-fees-dialog',
  templateUrl: './saved-gas-fees-dialog.component.html',
  styleUrls: ['./saved-gas-fees-dialog.component.scss'],
  providers: [DestroyService],
})
export class SavedGasFeesDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(
    private httpService: HttpService,
    public vt: ViewTypeService,
    public cdRef: ChangeDetectorRef,
    protected destroy$: DestroyService,
    private log: NGXLogger,
    private hardworksService: HardworksService,
  ) {
    super(cdRef, vt, destroy$);
  }

  load(): void {
    this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network), 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.log.debug('History of All Hard Works loaded ', data);
        const chartBuilder = new ChartBuilder();
        const hwFees = new Map<number, number>();
        let savedGas = 0;

        data?.forEach(dto => {
          savedGas += dto.savedGasFees;
          hwFees.set(dto.blockDate, savedGas);
        });
        chartBuilder.initVariables(1);
        hwFees.forEach((fees, date) => chartBuilder.addInData(0, date, fees / 1000000));
        this.handleData(chartBuilder, [
          ['Saved Gas Fees M$', 'right', '#5CADAA'],
        ]);
      });
  }
}
