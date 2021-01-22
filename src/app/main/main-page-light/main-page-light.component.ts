import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {WebsocketService} from '../../services/websocket.service';
import {AllStatsDialogComponent} from '../../dialogs/all-stats-dialog/all-stats-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TvlDialogComponent} from '../../dialogs/tvl-dialog/tvl-dialog.component';
import {RewardsDialogComponent} from '../../dialogs/rewards-dialog/rewards-dialog.component';
import {StaticValues} from '../../static-values';
import {UserSettings} from '../../user-settings';

@Component({
  selector: 'app-main-page-light',
  templateUrl: './main-page-light.component.html',
  styleUrls: ['./main-page-light.component.css']
})
export class MainPageLightComponent implements OnInit {
  opened = false;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {
    this.vt.toggleTheme();
  }


  openAllStats(): void {
    this.dialog.open(AllStatsDialogComponent, {
      data: {}
    });
  }

  openTvlDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'All'
      }
    });
  }

  openIncomeDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'income'
      }
    });
  }

  openPsApyDialog(): void {
    this.dialog.open(RewardsDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: 'PS APY History',
        name: ''
      }
    });
  }

  uniInited(): boolean {
    return StaticValues.uniInited;
  }
}
