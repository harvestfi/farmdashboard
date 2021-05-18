import {AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {WebsocketService} from '../../services/websocket.service';
import {BusyNotifierService} from '../../services/busy-notifier.service';
import {MatDialog} from '@angular/material/dialog';
import {ApplicationErrorDialog} from './application-error-dialog';

@Component({
  selector: 'app-main-page-light',
  templateUrl: './main-page-light.component.html',
  styleUrls: ['./main-page-light.component.css']
})
export class MainPageLightComponent implements AfterContentInit {

  buffering = true;
  private errored = false;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService,
              public dialog: MatDialog,
              private loadingService: BusyNotifierService,
              private cdref: ChangeDetectorRef
              ) {
  }

  ngAfterContentInit(): void {
    this.loadingService.busy.subscribe(buffering => {
      this.buffering = buffering;
      this.cdref.detectChanges();
    });
    this.loadingService.failures.subscribe(err => {
      if(!this.errored && err instanceof Error){
        this.errored = true;
        this.dialog.open(ApplicationErrorDialog);
      }
    });
  }

}

