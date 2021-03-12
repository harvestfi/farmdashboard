import {Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ViewTypeService } from 'src/app/services/view-type.service';


@Component({
    selector: 'app-sortable-list',
    templateUrl: './sortable-list.component.html',
    styleUrls: ['./sortable-list.component.scss']
})
export class SortableListComponent implements AfterViewInit{
    @Input() tableData: Record<any, any>[] = [];
    @Input() tableHeaders;
    @ViewChild('table_head') table_head: ElementRef;
    @ViewChild('table_body') table_body: ElementRef;
    constructor(public vt: ViewTypeService){}

    ngAfterViewInit(): void {
        this.initializeTableHeaders();
        this.initializeData();
    }

    private initializeTableHeaders(): void{
        const headerRowElement = this.table_head.nativeElement.insertRow(-1);
        this.tableHeaders.forEach(headerLabel => {
            const headerLabelCell = headerRowElement.insertCell();
            headerLabelCell.innerHTML = headerLabel.title;
        });
    }

    private initializeData(): void{
        this.tableData.forEach(item =>{
            const itemValues = Object.values(item);
            let row = this.table_body.nativeElement.insertRow(-1);
            row.className = 'order';
            for (const value in itemValues){
                const cell = row.insertCell();
                cell.innerHTML = itemValues[value];
            }
        })
    }
}
