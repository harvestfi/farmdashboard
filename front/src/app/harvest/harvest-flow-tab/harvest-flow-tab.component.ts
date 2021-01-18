import { Component, Input, OnInit } from '@angular/core';
import { HarvestDto } from '../../models/harvest-dto';
import { ViewTypeService } from '../../services/view-type.service';
import { StaticValues } from '../../static-values';
import { Utils } from '../../utils';

@Component({
  selector: 'app-harvest-flow-tab',
  templateUrl: './harvest-flow-tab.component.html',
  styleUrls: ['./harvest-flow-tab.component.css']
})
export class HarvestFlowTabComponent implements OnInit {

  @Input() dtos: HarvestDto[] = [];
  @Input() maxHeight = 800;
  @Input() minAmount = 0;
  @Input() vaultFilter = 'all';
  @Input() showFullDate = false;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

  

  

}
