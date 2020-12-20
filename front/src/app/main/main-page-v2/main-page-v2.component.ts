import { Component, OnInit } from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {WebsocketService} from '../../services/websocket.service';
import {AllStatsDialogComponent} from '../../dialogs/all-stats-dialog/all-stats-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TvlDialogComponent} from '../../dialogs/tvl-dialog/tvl-dialog.component';

@Component({
  selector: 'app-main-page-v2',
  templateUrl: './main-page-v2.component.html',
  styleUrls: ['./main-page-v2.component.css']
})
export class MainPageV2Component implements OnInit {
  opened = false;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {
    this.vt.v2Theme = !this.vt.v2Theme;
  }

  openAllStats(): void {
    this.dialog.open(AllStatsDialogComponent, {
      data: {}
    });
  }

  openTvlDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height : 'auto',
      data: {
        type: 'All'
      }
    });
  }

  openIncomeDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height : 'auto',
      data: {
        type: 'income'
      }
    });
  }
}
