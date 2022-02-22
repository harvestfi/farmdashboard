import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../constants/routes.constant';

@Component({
  selector: 'app-collapsible-area',
  templateUrl: './collapsible-area.component.html',
  styleUrls: ['./collapsible-area.component.scss'],
})

export class CollapsibleAreaComponent {
  public isOpen = false;
  
  constructor(public router: Router) {
  }
  
  toggleCollapseArea(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.router.navigateByUrl(ROUTES.CHARTS_PS_APY_HISTORY);
    }
  }
  
  get chartRoute(): boolean {
    return this.router.isActive(ROUTES.CHARTS, false);
  }
  
  closeCollapseArea(): void {
    this.isOpen = false;
  }
}
