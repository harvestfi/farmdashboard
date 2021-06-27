import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  public vt: ViewTypeService = new ViewTypeService();

  constructor() {
  }

  ngOnInit(): void {
  }

}
