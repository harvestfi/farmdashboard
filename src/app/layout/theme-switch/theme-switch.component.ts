import { Component, OnInit } from '@angular/core';
import {UserSettings} from '@core/user-settings';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss']
})
export class ThemeSwitchComponent implements OnInit {
  isDarkTheme = UserSettings.getColor() === 'dark';

  constructor( public viewTypeService: ViewTypeService) {
      this.isDarkTheme = UserSettings.getColor() === 'dark';
  }

  ngOnInit(): void {
  }

  toggleTheme(): void {
      if (this.viewTypeService.getThemeColor() === 'dark') {
          this.viewTypeService.setThemeColor('light');
          return;
      }
      this.viewTypeService.setThemeColor('dark');
  }

}
