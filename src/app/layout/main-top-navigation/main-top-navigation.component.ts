import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {WebsocketService} from '@data/services/websocket.service';
import {BlockDiffService} from '@data/services/data/block-diff.service';
import {SideMenuService} from '@data/services/side-menu.service';

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

  public blockDiffs = new Map<string, number>();

  constructor(public ws: WebsocketService, public vt: ViewTypeService, private blockDiffService: BlockDiffService,
              private changeDetectorRef: ChangeDetectorRef,
              public viewTypeService: ViewTypeService,
              private sideMenuService: SideMenuService) {
  }

  ngOnInit(): void {
    this.blockDiffService.subscribeToBlockNumbers().subscribe(diff => {
      this.blockDiffs = new Map([...this.blockDiffs, [diff.network, diff.blockNum]]);
      this.changeDetectorRef.detectChanges();
    });
  }

  get sideMenuState(): any {
      return this.sideMenuService.getSideMenuState();
  }
  toggleMenu(): void {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width <= 1600) {
          this.sideMenuService.setSideMenuState(!this.sideMenuState);
      }
  }




}
