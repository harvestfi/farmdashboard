import {Component} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-collapsible-area',
  templateUrl: './collapsible-area.component.html',
  styleUrls: ['./collapsible-area.component.scss']
})

export class CollapsibleAreaComponent {
  public isOpen = false;

  constructor(public router: Router) {

  }


  toggleCollapseArea(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
        this.router.navigateByUrl('charts/ps-apy-history');
    }
  }

  get chartRoute(): boolean {
      return this.router.isActive('charts', false);
  }

  closeCollapseArea(): void {
    this.isOpen = false;
  }
}
