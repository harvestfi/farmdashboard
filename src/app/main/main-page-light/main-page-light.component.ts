import {Component, OnInit} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';
import {WebsocketService} from '../../services/websocket.service';
import {StaticValues} from '../../static/static-values';

@Component({
  selector: 'app-main-page-light',
  templateUrl: './main-page-light.component.html',
  styleUrls: ['./main-page-light.component.css']
})
export class MainPageLightComponent implements OnInit {
  opened = false;

  constructor(public vt: ViewTypeService,
              public ws: WebsocketService) {
  }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleTheme(): void {
    this.vt.toggleTheme();
  }

  uniInited(): boolean {
    return StaticValues.uniInited;
  }
}
