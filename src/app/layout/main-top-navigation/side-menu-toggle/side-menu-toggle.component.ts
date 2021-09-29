import { Component, OnInit } from '@angular/core';
import {SideMenuService} from '@data/services/side-menu.service';

@Component({
  selector: 'app-side-menu-toggle',
  templateUrl: './side-menu-toggle.component.html',
  styleUrls: ['./side-menu-toggle.component.css']
})
export class SideMenuToggleComponent implements OnInit {

  constructor( private sideMenuService: SideMenuService) { }

  ngOnInit(): void {
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

}
