import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BusyNotifierService } from '@data/services/busy-notifier.service';
import { ViewTypeService } from '@data/services/view-type.service';
import { TheGraphService } from '@data/services/thegraph-service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterContentInit, OnInit {
  loading = true;
  subGraphs = [];

  constructor(private loadingService: BusyNotifierService,
              private cdref: ChangeDetectorRef,
              public vt: ViewTypeService,
              private theGraphService: TheGraphService
  ) {
  }

  ngOnInit(): void {
    this.onGetTheGraphSubGraph();
  }

  ngAfterContentInit(): void {
    this.loadingService.busy.subscribe(loading => {
      this.loading = loading;
      this.cdref.detectChanges();
    });
  }

  onGetTheGraphSubGraph(): void {
    this.theGraphService.getSubGraphs()
        .subscribe((data: {subgraphs: []}) => {
          console.log(data.subgraphs);
          this.subGraphs = data.subgraphs;
          this.getExactSubGraph(this.subGraphs[0].id);
        }, err => {
          console.log(err);
        });
  }

  getExactSubGraph(id): void {
      this.theGraphService.getExactSubGraph(id)
          .subscribe(data => {
              console.log(data.subgraph);
          }, err => {
              console.log(err);
          });
  }


}
