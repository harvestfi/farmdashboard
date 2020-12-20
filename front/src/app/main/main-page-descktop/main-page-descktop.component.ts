import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-main-page-descktop',
  templateUrl: './main-page-descktop.component.html',
  styleUrls: ['./main-page-descktop.component.css']
})
export class MainPageDescktopComponent implements OnInit {

  opened = false;

  constructor(public vt: ViewTypeService) { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {
    this.vt.v2Theme = !this.vt.v2Theme;
  }
}
