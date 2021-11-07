import {Component, Input} from '@angular/core';
import {HarvestDto} from '@data/models/harvest-dto';
import {ViewTypeService} from '@data/services/view-type.service';


@Component({
  selector: 'app-harvest-flow-tab',
  templateUrl: './harvest-flow-tab.component.html',
  styleUrls: ['./harvest-flow-tab.component.scss']
})
export class HarvestFlowTabComponent {

  @Input() dtos: HarvestDto[] = [];
  @Input() maxHeight = 400;
  @Input() minAmount = 0;
  @Input() vaultFilter = 'all';
  @Input() showFullDate = false;
  @Input() vaultsIconsList;

  constructor(public vt: ViewTypeService) {
  }
}
