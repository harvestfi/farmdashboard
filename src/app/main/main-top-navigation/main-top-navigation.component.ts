import {Component} from '@angular/core';
import {ViewTypeService} from 'src/app/services/view-type.service';
import {WebsocketService} from 'src/app/services/websocket.service';

@Component({
  selector: 'app-main-top-navigation',
  templateUrl: './main-top-navigation.component.html',
  styleUrls: ['./main-top-navigation.component.scss']
})
export class MainTopNavigationComponent {
  public networks = [
    {
      name: 'eth',
      icon: 'assets/icons/common/eth.svg'
    },
    {
      name: 'bsc',
      icon: 'assets/icons/common/wbnb.png'
    }
  ];

  constructor(public ws: WebsocketService, public vt: ViewTypeService) {
  }
}
