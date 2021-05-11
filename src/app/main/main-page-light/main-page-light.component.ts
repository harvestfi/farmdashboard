import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {WebsocketService} from '../../services/websocket.service';
import {StaticValues} from '../../static/static-values';
import {HttpMetricsService} from '../../services/http-metrics.service';

@Component({
  selector: 'app-main-page-light',
  templateUrl: './main-page-light.component.html',
  styleUrls: ['./main-page-light.component.css']
})
export class MainPageLightComponent implements OnInit {

  buffering = true;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService,
              private loadingService: HttpMetricsService) {
                console.log(ws.isConnected());
  }

  ngOnInit(): void {
    this.loadingService.events.subscribe(v => this.buffering = v);
  }

}
