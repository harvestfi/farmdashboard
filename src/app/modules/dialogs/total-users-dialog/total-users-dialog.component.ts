import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ViewTypeService } from '@data/services/view-type.service';
import { NGXLogger } from 'ngx-logger';
import { ChartBuilder } from '../../chart/chart-builder';
import { ChartGeneralMethodsComponent } from '@modules/chart/chart-general-methods.component';
import { TvlsService } from '@data/services/http/tvls.service';
import { StaticValues } from '@data/static/static-values';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-total-users-dialog',
  templateUrl: './total-users-dialog.component.html',
  styleUrls: ['./total-users-dialog.component.scss'],
  providers: [DestroyService],
})
export class TotalUsersDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(
    public vt: ViewTypeService,
    public cdRef: ChangeDetectorRef,
    protected destroy$: DestroyService,
    private log: NGXLogger,
    private tvlService: TvlsService,
  ) {
    super(cdRef, vt, destroy$);
  }

  load(): void {
    this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.network))
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.log.debug('History of All Harvests loaded ', data);
        const chartBuilder = new ChartBuilder();
        chartBuilder.initVariables(2);
        data?.forEach(dto => {
          chartBuilder.addInData(0, dto.calculateTime, dto.lastAllOwnersCount);
          chartBuilder.addInData(1, dto.calculateTime, dto.lastTvl);
        });

        this.handleData(chartBuilder, [
          ['Total users', 'right', '#5CADAA'],
          ['TVL', '1', '#eeb000'],
        ]);
      });
  }
}
