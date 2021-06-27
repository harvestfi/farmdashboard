import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.css']
})
export class SimpleModalComponent implements OnInit {
  public vt: ViewTypeService = new ViewTypeService();

  constructor() {
  }

  ngOnInit(): void {
  }

}
