import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {EChartsOption} from 'echarts/types/src/export/option';
import {ChartSeries} from '@modules/dashboard/vault-stats/models/chart-series.model';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.scss']
})
export class EchartComponent implements OnInit {

  tempData: ChartSeries[] = [];
  @Input() title = '';
  @Input() selectedValue = '';
  @Input() selectedDate = '';
  @Input() valueSymbol = '';
  @Input() options: EChartsOption;
  updateOptions: any;
  selectedPeriod = 0;
  primaryData = [];

  @Input()
  set data(value: ChartSeries[]) {
    if (value.length) {
      this.tempData = value;
      this.primaryData = [...this.tempData];
      this.setDefaultTooltipValues();
    }
  }

  get data(): ChartSeries[] {
    return this.tempData;
  }

  @Output() changePeriod: EventEmitter<number> = new EventEmitter<number>();

  constructor(public vt: ViewTypeService) { }

  ngOnInit(): void {
  }

  nFormatter(num, digits): any {

        const lookup = [
            { value: 1, symbol: '' },
            { value: 1e3, symbol: 'k' },
            { value: 1e6, symbol: 'M' },
            { value: 1e9, symbol: 'b' },
            { value: 1e12, symbol: 't' },
            { value: 1e15, symbol: 'p' },
            { value: 1e18, symbol: 'e' }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup.slice().reverse().find((it) => num >= it.value);
        return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0.00';
    }

  setDefaultTooltipValues(): void {
      if (this.valueSymbol === '%') {
          const temp = this.data[this.data.length - 1].value[1];
          let value = this.nFormatter(temp, 2);
          if (+temp < 1) {
              const tempNumber = +temp;
              value = tempNumber.toFixed(2);
          }
          this.selectedValue = value + this.valueSymbol;
      } else {
          this.selectedValue = this.valueSymbol + this.nFormatter(this.data[this.data.length - 1].value[1], 2);
      }
      this.selectedDate = new Date(this.data[this.data.length - 1].name).toString();
  }

  onChartEvent(event: any, type: string): void {
      this.setDefaultTooltipValues();
  }

  selectPeriod(period): void {
      this.selectedPeriod = period;

      this.changePeriod.emit(period);

      this.updateOptions = {
        series: [{
          data: this.filterDataByPeriod(period),
        }],
        xAxis: this.options ? this.options.xAxis : '',
      };
  }



  filterDataByPeriod(period): any {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const halfYearAgo = new Date();
      halfYearAgo.setDate(halfYearAgo.getDate() - 180);
      const seriesData = [...this.primaryData];
      if (!period) {
          return this.primaryData;
      }
      if (period === 1) {
          return seriesData.filter((item) => (new Date(item.name).getTime() > monthAgo.getTime()));
      }
      if (period === 6) {
          return seriesData.filter((item) => (new Date(item.name).getTime() > halfYearAgo.getTime()));
      }
  }
}
