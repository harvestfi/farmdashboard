import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewTypeService } from '@data/services/view-type.service';
import { SideMenuService } from '@data/services/side-menu.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/routes.constant';
import { MENU_ITEMS } from '../../constants/menu.constant';

@Component({
  selector: 'app-main-side-menu',
  templateUrl: './main-side-menu.component.html',
  styleUrls: ['./main-side-menu.component.scss'],
  animations: [
    trigger('openMenu', [
      state('open', style({
        transform: 'translateX(0%)',
      })),
      state('closed', style({
        transform: 'translateX(-100%)',
      })),
      transition('open => closed', [
        animate('0.5s'),
      ]),
      transition('closed => open', [
        animate('0.45s'),
      ]),
    ]),
  ],
})
export class MainSideMenuComponent implements OnInit {
  @ViewChild('collapsibleArea', { static: true }) collapsibleArea;
  
  ROUTES = ROUTES;
  MENU_ITEMS = MENU_ITEMS;
  menuItems = [];
  
  constructor(
    public viewTypeService: ViewTypeService,
    private sideMenuService: SideMenuService,
    public router: Router,
  ) {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    if (width > 1600) {
      this.sideMenuService.setSideMenuState(true);
    }
  }
  
  ngOnInit() {
    this.menuItems = Object.keys(MENU_ITEMS);
  }
  
  @HostListener('window:resize', ['$event'])
  handleScreenResize(): void {
    const newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    if (newWidth > 1600) {
      this.sideMenuService.setSideMenuState(true);
    }
  }
  
  isRouteActive(routeLink: string): boolean {
    return this.router.isActive(routeLink, true);
  }
  
  get sideMenuState(): any {
    return this.sideMenuService.getSideMenuState();
  }
  
  toggleMenu(): void {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    if (width <= 1600) {
      this.sideMenuService.setSideMenuState(!this.sideMenuState);
    }
  }
  
  openRoute(routeLink: string, isCollapseArea: boolean = false): void {
    this.toggleMenu();
    
    this.router.navigateByUrl(routeLink);
    
    if (isCollapseArea) {
      this.collapsibleArea.closeCollapseArea();
    }
  }
}
