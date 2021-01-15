import {Injectable} from '@angular/core';
import {UserSettings} from '../user-settings';

@Injectable({
  providedIn: 'root'
})
export class ViewTypeService {
  private themeScoreboard = 'scoreboard';
  private themeLight = 'light';

  constructor() {
  }

  toggleTheme(): void {
    if (UserSettings.getTheme() === this.themeLight) {
      UserSettings.setTheme(this.themeScoreboard);
    } else {
      UserSettings.setTheme(this.themeLight);
    }
  }

  public isNonScoreboard(): boolean {
    return UserSettings.getTheme() !== this.themeScoreboard;
  }
}
