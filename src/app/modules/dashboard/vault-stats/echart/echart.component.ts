import {Component, Input, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts/types/src/export/option';
import {ChartSeries} from '@modules/dashboard/vault-stats/models/chart-series.model';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.css']
})
export class EchartComponent implements OnInit {

  @Input() title = '';
  @Input() chartName = '';
  @Input() selectedValue = '';
  @Input() selectedDate = '';
  @Input() valueSymbol = '';
  @Input() options: EChartsOption;
  @Input() data: ChartSeries[];


  constructor() { }

  ngOnInit(): void {
      this.setDefaultTooltipValues();
  }

  nFormatter(num, digits): any {

        const lookup = [
            { value: 1, symbol: '' },
            { value: 1e3, symbol: 'k' },
            { value: 1e6, symbol: 'm' },
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
      this.selectedValue = this.valueSymbol + this.nFormatter(this.data[this.data.length - 1].value[1], 2);
      this.selectedDate = new Date(this.data[this.data.length - 1].name).toString();
  }

  onChartEvent(event: any, type: string): void {
      this.setDefaultTooltipValues();
  }
}
