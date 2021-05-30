import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewTypeService} from 'src/app/services/view-type.service';
import {WebsocketService} from 'src/app/services/websocket.service';
import {BlockDiffService} from '../../services/data/block-diff.service';

@Component({
  selector: 'app-main-top-navigation',
  templateUrl: './main-top-navigation.component.html',
  styleUrls: ['./main-top-navigation.component.scss']
})
export class MainTopNavigationComponent implements OnInit {
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

  public blockDiffs = new Map<string,number>();

  constructor(public ws: WebsocketService, public vt: ViewTypeService, private blockDiffService: BlockDiffService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.blockDiffService.subscribeToBlockNumbers().subscribe(diff => {
      this.blockDiffs = new Map([...this.blockDiffs,[diff.network, diff.blockNum]]);
      this.changeDetectorRef.detectChanges();
    });
  }


}
