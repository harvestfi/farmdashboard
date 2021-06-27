import {Injectable} from '@angular/core';
import {UserSettings} from '@core/user-settings';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewTypeService {
  private subject = new Subject<any>();

  constructor() {
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

  public newEvent(event): void {
    this.subject.next(event);
  }

  get events$(): Observable<any> {
    return this.subject.asObservable();
  }
}
