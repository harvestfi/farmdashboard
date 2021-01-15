import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-main-page-scoreboard',
  templateUrl: './main-page-scoreboard.component.html',
  styleUrls: ['./main-page-scoreboard.component.css']
})
export class MainPageScoreboardComponent implements OnInit {
  opened = false;

  constructor(public vt: ViewTypeService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {
    this.vt.toggleTheme();
    this.cdRef.detectChanges();
  }
}
