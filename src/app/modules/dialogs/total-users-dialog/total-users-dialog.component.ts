import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '@modules/chart/chart-general-methods.component';
import {TvlsService} from '@data/services/http/tvls.service';
import {StaticValues} from '@data/static/static-values';

@Component({
  selector: 'app-total-users-dialog',
  templateUrl: './total-users-dialog.component.html',
  styleUrls: ['./total-users-dialog.component.scss']
})
export class TotalUsersDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private tvlService: TvlsService) {
    super(cdRef, vt);
  }

  load(): void {
    this.tvlService.getHistoryAllTvl(StaticValues.NETWORKS.get(this.network)).subscribe(data => {
      this.log.debug('History of All Harvests loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => {
        chartBuilder.addInData(0, dto.calculateTime, dto.lastAllOwnersCount);
        chartBuilder.addInData(1, dto.calculateTime, dto.lastTvl);
      });

      this.handleData(chartBuilder, [
        ['Total users', 'right', '#0085ff'],
        ['TVL', '1', '#eeb000']
      ]);
    });
  }
}
