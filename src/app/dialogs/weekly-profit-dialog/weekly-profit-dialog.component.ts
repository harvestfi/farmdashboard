import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';
import {HardworksService} from '../../services/http/hardworks.service';
import {StaticValues} from '../../static/static-values';

@Component({
  selector: 'app-weekly-profit-dialog',
  templateUrl: './weekly-profit-dialog.component.html',
  styleUrls: ['./weekly-profit-dialog.component.scss']
})
export class WeeklyProfitDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger,
              private hardworksService: HardworksService,
  ) {
    super(cdRef, vt);
  }

  load(): void {
    this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network)).subscribe(data => {
      this.log.debug('History of All Profits loaded ', data);
      const chartBuilder = new ChartBuilder();
      chartBuilder.initVariables(2);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, (dto.weeklyAllProfit) / 1000));
      data?.forEach(dto => chartBuilder.addInData(1, dto.blockDate, dto.allProfit / 1000000));
      this.handleData(chartBuilder, [
        ['Weekly Profit K$', 'right', '#0085ff'],
        ['All profit M$', '1', '#eeb000']
      ]);
    });
  }
}
