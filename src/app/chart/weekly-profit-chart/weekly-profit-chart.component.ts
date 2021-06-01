import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ViewTypeService } from '../../services/view-type.service';
import { StaticValues } from '../../static/static-values';

@Component({
  selector: 'app-weekly-profit-chart',
  templateUrl: './weekly-profit-chart.component.html',
  styleUrls: ['./weekly-profit-chart.component.scss']
})
export class WeeklyProfitChartComponent implements OnInit {

  @Input('ready') ready: boolean;
  @Input('multipleNetworks') multipleNetworks = true;
  @Output() network = new EventEmitter<string>();
  @ViewChild('chart') chartEl: ElementRef;
  networks: string[] = Array.from(StaticValues.NETWORKS.keys());
  network_icons: Map<string, string> = StaticValues.NETWORK_ICON;
  chosenNetwork = 'eth';

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  choseNetwork(): void {
    this.network.emit(this.chosenNetwork);
  }

}
