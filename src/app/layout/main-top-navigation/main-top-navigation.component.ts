import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {WebsocketService} from '@data/services/websocket.service';
import {BlockDiffService} from '@data/services/data/block-diff.service';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main-top-navigation',
  templateUrl: './main-top-navigation.component.html',
  styleUrls: ['./main-top-navigation.component.scss'],
  providers: [DestroyService],
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
    },
    {
      name: 'matic',
      icon: 'assets/icons/common/matic.png'
    },
  ];

  public blockDiffs = new Map<string, number>();

  constructor(
    public ws: WebsocketService,
    public vt: ViewTypeService,
    private blockDiffService: BlockDiffService,
    private changeDetectorRef: ChangeDetectorRef,
    public viewTypeService: ViewTypeService,
    private destroy$: DestroyService,
  ) {
  }

  ngOnInit(): void {
    this.blockDiffService.subscribeToBlockNumbers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(diff => {
        this.blockDiffs = new Map([...this.blockDiffs, [diff.network, diff.blockNum]]);
        this.changeDetectorRef.detectChanges();
      });
  }
}
