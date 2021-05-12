import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {StaticValues} from '../../static/static-values';

@Component({
  selector: 'app-chart-general',
  templateUrl: './chart-general.component.html',
  styleUrls: ['./chart-general.component.scss']
})
export class ChartGeneralComponent implements OnInit {

  @Input('title') title: string;
  @Input('ready') ready: boolean;
  @Input('multipleNetworks') multipleNetworks = true;
  @Output() network = new EventEmitter<string>();
  @ViewChild('chart') chartEl;
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
