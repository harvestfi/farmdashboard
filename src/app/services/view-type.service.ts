import {Injectable} from '@angular/core';
import {UserSettings} from '../user-settings';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ViewTypeService {
  private themeScoreboard = 'scoreboard';
  private themeLight = 'light';
  private subject = new Subject<any>();

  constructor() {
  }

  toggleTheme(): void {
    if (UserSettings.getTheme() === this.themeLight) {
      UserSettings.setTheme(this.themeScoreboard);
    } else {
      UserSettings.setTheme(this.themeLight);
    }
    window.location.reload();
  }

  public isNonScoreboard(): boolean {
    return UserSettings.getTheme() !== this.themeScoreboard;
  }

  public getThemeColor(): string {
    const color = UserSettings.getColor() || 'light';
    return color;
  }

  public setThemeColor(color: string): void {
    UserSettings.setColor(color);
    this.newEvent('theme-changed');
  }

  public isDarkMode(): boolean {
    return this.getThemeColor() === 'dark';
  }

  newEvent(event): void {
    this.subject.next(event);
  }

  get events$(): Observable<any>{
    return this.subject.asObservable();
  }
}
