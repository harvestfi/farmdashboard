import {Component, Input, OnInit} from '@angular/core';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-hardwork-flow-tab',
  templateUrl: './hardwork-flow-tab.component.html',
  styleUrls: ['./hardwork-flow-tab.component.css']
})
export class HardworkFlowTabComponent implements OnInit {
  @Input() dtos: HardWorkDto[] = [];
  @Input() maxHeight: number;
  @Input() showFullDate = false;
  @Input() vaultFilter = 'all';
  @Input() minAmount = 0;
  @Input() showMoreColumns = false;
  @Input() vaultsIconsList;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

}
