import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-chart-general',
  templateUrl: './chart-general.component.html',
  styleUrls: ['./chart-general.component.css']
})
export class ChartGeneralComponent implements OnInit {

  @Input('title') title: string;
  @Input('ready') ready: boolean;
  @ViewChild('chart') chartEl;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

}
