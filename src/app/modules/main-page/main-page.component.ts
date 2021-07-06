import {AfterContentInit, ChangeDetectorRef, Component} from '@angular/core';
import {BusyNotifierService} from '@data/services/busy-notifier.service';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterContentInit {
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
