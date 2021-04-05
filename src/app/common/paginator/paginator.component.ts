import { Component, EventEmitter, Input, Output } from '@angular/core';



type PaginatedObject = {
    current_page: number, //current page
    next_page: number,
    previous_page: number,
    total_pages: number,
    data: any[]
}
@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
    @Output() onNextPage = new EventEmitter();
    @Output() onPreviousPage = new EventEmitter();
    @Output() onSelectPage = new EventEmitter();
    @Input ('pageObject') pageObject: PaginatedObject;    

    handleNextPage(): void {
        console.log(this.pageObject.data);
        this.onNextPage.emit(this.pageObject.next_page);
    }

    handlePreviousPage(): void {
        this.onPreviousPage.emit(this.pageObject.previous_page);
    }

    handleSelectPage(page): void {
        if (page === '...') {
            return;
        }
        this.onSelectPage.emit(page)
    }

    get pageRange(): number[] {
        const current = this.pageObject.current_page;
        const last = this.pageObject.total_pages;
        const delta = 1;
        const left = current - delta;
        const right = current + delta + 1;
        const range = []
        const pages = [];
        let l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right)){
                range.push(i);
            }
        }

        range.forEach(i => {
            if (l) {
                if (i - 1 === 2) {
                    pages.push(l + 1);
                } else if (i - l !== 1) {
                    pages.push('...')
                }
            } 
            pages.push(i);
            l = i;
        });

        return pages

    }
}