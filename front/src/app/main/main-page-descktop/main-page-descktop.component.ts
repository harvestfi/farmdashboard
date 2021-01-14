import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {UserSettings} from '../../user-settings';

@Component({
  selector: 'app-main-page-descktop',
  templateUrl: './main-page-descktop.component.html',
  styleUrls: ['./main-page-descktop.component.css']
})
export class MainPageDescktopComponent implements OnInit {

  opened = false;

  constructor(public vt: ViewTypeService) {
  }

  ngOnInit(): void {
    if (UserSettings.getTheme() ==='light') {
      this.vt.v2Theme = true;
    }else {
      this.vt.v2Theme = false;
    }

  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {

    this.vt.v2Theme = !this.vt.v2Theme;
    if (!this.vt.v2Theme) {
      UserSettings.theme = 'dark';
  }
  else {
    UserSettings.theme = 'light';
  }
    UserSettings.setTheme(UserSettings.theme);
  }
}
