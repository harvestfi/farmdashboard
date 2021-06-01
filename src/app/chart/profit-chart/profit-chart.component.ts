import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {HardworksService} from '../../services/http/hardworks.service';
import {StaticValues} from '../../static/static-values';
import { ChartProfitMethodsComponent } from '../chart-profit-methods.component';

@Component({
  selector: 'app-profit-chart',
  templateUrl: './profit-chart.component.html',
  styleUrls: ['./profit-chart.component.css']
})
export class ProfitChartComponent extends ChartProfitMethodsComponent implements AfterViewInit {

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
      chartBuilder.initVariables(1);
      data?.forEach(dto => chartBuilder.addInData(0, dto.blockDate, (dto.weeklyProfit) / 1000));
      this.handleData(chartBuilder, [
        ['Weekly Profit W$', 'right', '#ff00ff']
      ]);
    });
  }

}
