import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-main-page-view',
  templateUrl: './main-page-view.component.html',
  styleUrls: ['./main-page-view.component.css']
})
export class MainPageViewComponent implements OnInit {

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
  }

}
