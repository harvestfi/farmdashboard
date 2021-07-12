import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {StaticValues} from '@data/static/static-values';
import {EChartsOption} from 'echarts/types/src/export/option';

@Component({
  selector: 'app-chart-general',
  templateUrl: './chart-general.component.html',
  styleUrls: ['./chart-general.component.scss']
})
export class ChartGeneralComponent implements OnInit {

  @Input('title') title: string;
  @Input('ready') ready: boolean;
  @Input('tabs') tabs: boolean;
  @Input('options') options: EChartsOption;
  @Input('multipleNetworks') multipleNetworks = true;
  @Output() network = new EventEmitter<string>();
  @ViewChild('chart') chartEl;
  networks: string[] = Array.from(StaticValues.NETWORKS.keys());
  networkIcons: Map<string, string> = StaticValues.NETWORK_ICON;
  chosenNetwork = 'eth';
  tabIndex = 0 ;
  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  changeTab(event): void {
    this.tabIndex = event.index;
  }

  choseNetwork(): void {
    this.network.emit(this.chosenNetwork);
  }

}
