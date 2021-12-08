import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BusyNotifierService } from '@data/services/busy-notifier.service';
import { ViewTypeService } from '@data/services/view-type.service';
import { TheGraphService } from '@data/services/thegraph-service';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [DestroyService],
})
export class MainPageComponent implements AfterContentInit, OnInit {
  loading = true;
  subGraphs = [];

  constructor(
    private loadingService: BusyNotifierService,
    private cdref: ChangeDetectorRef,
    public vt: ViewTypeService,
    private theGraphService: TheGraphService,
    private destroy$: DestroyService,
  ) {
  }

  ngOnInit(): void {
    // this.onGetTheGraphSubGraph();
  }

  ngAfterContentInit(): void {
    this.loadingService.busy
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdref.detectChanges();
      });
  }

  onGetTheGraphSubGraph(): void {
    this.theGraphService.getSubGraphs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { subgraphs: [] }) => {
        // console.log(data.subgraphs);
        this.subGraphs = data.subgraphs;
        // this.getExactSubGraph(this.subGraphs[0].id);
      }, err => {
        console.log(err);
      });
  }

  getExactSubGraph(id): void {
    this.theGraphService.getExactSubGraph(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // console.log(data.subgraph);
      }, err => {
        console.log(err);
      });
  }


}
