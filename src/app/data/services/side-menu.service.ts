import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideMenuService {
  private showSideMenu = false;
  
  getSideMenuState(): boolean {
    return this.showSideMenu;
  }
  
  setSideMenuState(state): void {
    this.showSideMenu = state;
  }
}
