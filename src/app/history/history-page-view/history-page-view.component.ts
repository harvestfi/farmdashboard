import { Component, OnInit } from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-history-page-view',
  templateUrl: './history-page-view.component.html',
  styleUrls: ['./history-page-view.component.css']
})
export class HistoryPageViewComponent implements OnInit {

  constructor(public vt: ViewTypeService) { }

  ngOnInit(): void {
  }

}
