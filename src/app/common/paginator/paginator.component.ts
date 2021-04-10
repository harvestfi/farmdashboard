// /* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewTypeService } from 'src/app/services/view-type.service';

type PaginatedObject = {
  currentPage: number; //current page
  nextPage: number;
  previousPage: number;
  totalPages: number;
  data: any[];
};
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Output() nextPage = new EventEmitter();
  @Output() previousPage = new EventEmitter();
  @Output() selectPage = new EventEmitter();
  @Input('pageObject') pageObject: PaginatedObject;
  public vt: ViewTypeService = new ViewTypeService();

  handleNextPage(): void {
    this.nextPage.emit(this.pageObject.nextPage);
  }

  handlePreviousPage(): void {
    this.previousPage.emit(this.pageObject.previousPage);
  }

  handleSelectPage(page): void {
    if (page === '...') {
      return;
    }
    this.selectPage.emit(page - 1);
  }

  get pageRange(): number[] {
    const current = this.pageObject.currentPage;
    const last = this.pageObject.totalPages;
    const delta = 1;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const pages = [];
    let l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        range.push(i);
      }
    }
    range.forEach((i) => {
      if (l) {
        if (i - l !== 1) {
          pages.push('...');
        }
      }
      pages.push(i);
      l = i;
    });

    return pages;
  }
}
