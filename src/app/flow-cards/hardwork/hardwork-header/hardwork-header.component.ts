import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hardwork-header',
  templateUrl: './hardwork-header.component.html',
  styleUrls: ['./hardwork-header.component.scss']
})
export class HardworkHeaderComponent implements OnInit {


  constructor() {
  }

  @Input() showMoreColumns = false;

  ngOnInit(): void {
  }

}
