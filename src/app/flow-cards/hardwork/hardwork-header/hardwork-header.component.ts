import {Component, Input, OnInit} from '@angular/core';
import { ViewTypeService } from 'src/app/services/view-type.service';

@Component({
  selector: 'app-hardwork-header',
  templateUrl: './hardwork-header.component.html',
  styleUrls: ['./hardwork-header.component.scss']
})
export class HardworkHeaderComponent implements OnInit {


  constructor(public vt: ViewTypeService) {
  }

  @Input() showMoreColumns = false;

  ngOnInit(): void {
  }

}
