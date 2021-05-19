import {AfterContentInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BusyNotifierService} from '../../services/busy-notifier.service';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-center-view',
  templateUrl: './center-view.component.html',
  styleUrls: ['./center-view.component.css']
})
export class CenterViewComponent implements AfterContentInit {
  loading = true;

  constructor(private loadingService: BusyNotifierService,
              private cdref: ChangeDetectorRef,
              public vt: ViewTypeService
  ) {
  }

  ngAfterContentInit(): void {
    this.loadingService.busy.subscribe(loading => {
      this.loading = loading;
      this.cdref.detectChanges();
    });
  }

}
