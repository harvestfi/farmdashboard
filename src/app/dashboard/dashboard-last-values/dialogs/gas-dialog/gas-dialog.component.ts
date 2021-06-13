import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {StaticValues} from '../../../../static/static-values';
import {ViewTypeService} from '../../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from 'src/app/chart/chart-general-methods.component';
import {HarvestsService} from '../../../../services/http/harvests.service';

@Component({
  selector: 'app-gas-dialog',
  templateUrl: './gas-dialog.component.html',
  styleUrls: ['./gas-dialog.component.css']
})
export class GasDialogComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

  constructor(private harvestsService: HarvestsService,
              public vt: ViewTypeService,
              public cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
    super(cdRef, vt);
  }

  load(): void {
    const currentDate = Math.ceil(new Date().getTime() / 1000);
    this.harvestsService.getHarvestTxHistoryByRange(
        currentDate - StaticValues.SECONDS_OF_MONTH,
        currentDate, StaticValues.NETWORKS.get(this.network)).subscribe(data => {
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
        ['Gas price', 'right', '#0085ff'],
      ]);
    });
  }
}
