import {Component, Input, OnInit} from '@angular/core';
import {HardWorkDto} from 'src/app/models/hardwork-dto';
import {StaticValues} from '../../../static/static-values';
import {Utils} from '../../../static/utils';


@Component({
  selector: 'app-hardwork-trade',
  templateUrl: './hardwork-trade.component.html',
  styleUrls: ['./hardwork-trade.component.scss']
})
export class HardworkTradeComponent implements OnInit {

  @Input() dto: HardWorkDto;
  @Input() fullDate = false;
  @Input() moreColumns = false;
  openModal = false;
  hash = '';

  constructor() {
  }

  ngOnInit(): void {
    const temp = this.dto.id.split('_');
    this.hash = temp[0];

  }

}
