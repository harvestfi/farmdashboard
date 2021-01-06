import {Component, OnInit} from '@angular/core';
import {WebsocketService} from '../../services/websocket.service';

@Component({
  selector: 'app-main-components',
  templateUrl: './main-components.component.html',
  styleUrls: ['./main-components.component.css']
})
export class MainComponentsComponent implements OnInit {

  constructor(public ws: WebsocketService) {
    this.ws.connectSockJs();
  }

  ngOnInit(): void {
  }

}
