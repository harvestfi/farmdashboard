import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {HttpService} from '@data/services/http/http.service';
import {ViewTypeService} from '@data/services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {ChartGeneralMethodsComponent} from '@modules/chart/chart-general-methods.component';
import {HardworksService} from '@data/services/http/hardworks.service';
import {StaticValues} from '@data/static/static-values';

@Component({
  selector: 'app-saved-gas-fees',
  templateUrl: './saved-gas-fees.component.html',
  styleUrls: ['./saved-gas-fees.component.scss']
})
export class SavedGasFeesComponent extends ChartGeneralMethodsComponent implements AfterViewInit {

    constructor(private httpService: HttpService,
                public vt: ViewTypeService,
                public cdRef: ChangeDetectorRef,
                private log: NGXLogger,
                private hardworksService: HardworksService,
    ) {
        super(cdRef, vt);
    }

    load(): void {
        this.hardworksService.getHardWorkHistoryData(StaticValues.NETWORKS.get(this.network), 1)
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
                    ['Saved Gas Fees M$', 'right', '#0085ff']
                ]);
            });
    }
}
