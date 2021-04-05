import { Component, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from '../../services/http.service';
import { NGXLogger } from 'ngx-logger';
import { StaticValues } from 'src/app/static/static-values';
import { ViewTypeService } from '../../services/view-type.service';
import { HardWorkDto } from '../../models/hardwork-dto';

@Component({
  selector: 'app-hard-work-history-list-dialog',
  templateUrl: './hard-work-history-list-dialog.component.html',
  styleUrls: ['./hard-work-history-list-dialog.component.scss']
})
export class HardWorkHistoryListDialogComponent implements AfterViewInit {
  dtos: HardWorkDto[] = [];
  hardWorkIds = new Set<string>();
  lowestBlockDate = 999999999999;
  vaultFilter = 'all';
  disabled  = false;
  ready = false;
  currentPage = 1;
  pageSize = 10;
  pageEvent: PageEvent;
  constructor(
    private hwListHistory: HttpService,
    public vt: ViewTypeService,
    private log: NGXLogger

  ) { }

  ngAfterViewInit(): void {
    this.hwListHistory.getHardWorkHistoryData().subscribe(data => this.addInArray(data)).add(() => this.ready = true);
    this.hwListHistory.getPaginatedHardworkHistoryData().subscribe(data => console.log(data));
  }

  get paginatedDTOs(): any{

    function paginate(elements, current_page=1, elements_per_page=10){
      let page = current_page;
      let per_page = elements_per_page;
      let offset = (page - 1) * per_page;

      let paginated_elements = elements.slice(offset).slice(0, elements_per_page);
      const total_pages = Math.ceil(elements.length / per_page);
      return {
        current_page: page,
        next_page: (total_pages > page) ? page + 1 : null,
        previous_page: (page - 1) ? page - 1 : null,
        total_pages: total_pages,
        data: paginated_elements,
      }
    }



    let paginatedItems = paginate(this.dtos, this.currentPage, this.pageSize);
    

    return paginatedItems;
  }

  get vaultNames(): string[] {
    return StaticValues.currentVaults;
  }

  nextPage($event): void {
    this.currentPage = $event;
  }

  previousPage($event): void {
    this.currentPage = $event;
  }

  selectPage($event): void {
    this.currentPage = $event;
  }

  getOlderHardworks(): void {
    this.disabled = true;
    if (this.lowestBlockDate === 0) {
      return;
    }
    this.hwListHistory.getHWHistoryDataByRange(this.lowestBlockDate - (StaticValues.SECONDS_OF_DAY * 2),
    this.lowestBlockDate).subscribe(data => this.addInArray(data)).add(() => this.disabled = false);
  }

  private isUniqHardwork(hw: HardWorkDto): boolean {
    if (this.hardWorkIds.has(hw.id)) {
      return false;
    }
    this.hardWorkIds.add(hw.id);
    if (this.hardWorkIds.size > 100_000) {
      this.hardWorkIds = new Set<string>();
    }
    return true;
  }

  private addInArray(newValues: HardWorkDto[]): void {
    this.log.info('New hard work values', newValues);
 
    for (let i = newValues.length - 1; i > 0; i--) {
      const hardWork = newValues[i];
      if (!this.isUniqHardwork(hardWork)) {
        this.log.warn('Not unique transaction', hardWork);
        continue;
      }
      if (hardWork.blockDate < this.lowestBlockDate) {
        this.lowestBlockDate = hardWork.blockDate;
      }
      HardWorkDto.enrich(hardWork);
      this.dtos.push(hardWork);      
    }
  }

}
