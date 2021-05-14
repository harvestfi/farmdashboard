import {Component, OnInit, ViewChild} from '@angular/core';
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
export class MainPageLightComponent implements OnInit {

  buffering = true;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService,
              public dialog: MatDialog,
              private loadingService: BusyNotifierService) {
                console.log(ws.isConnected());
  }

  ngOnInit(): void {
    this.loadingService.busy.subscribe(buffering => {
      console.log('====> setting buffering to', buffering);
      this.buffering = buffering;
    });
    this.loadingService.failures.subscribe(err => {
      if(err instanceof Error){
        this.dialog.open(ApplicationErrorDialog);
        console.log(`ERROR HAPPENED: ${err}`);
      }
    });
  }

}

