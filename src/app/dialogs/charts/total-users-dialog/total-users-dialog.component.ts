import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http/http.service';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';
import {HarvestTvl} from '../../../models/harvest-tvl';
import {TvlsService} from '../../../services/http/tvls.service';

@Component({
  selector: 'app-total-users-dialog',
  templateUrl: './total-users-dialog.component.html',
  styleUrls: ['./total-users-dialog.component.css']
})
export class TotalUsersDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private tvlService: TvlsService) {
    super(cdRef, vt);
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.tvlService.getHistoryAllTvl().subscribe(data => {
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
