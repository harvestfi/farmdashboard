import {Component} from '@angular/core';


@Component({
    selector: 'app-collapsible-area',
    templateUrl: './collapsible-area.component.html',
    styleUrls: ['./collapsible-area.component.scss']
})

export class CollapsibleAreaComponent {
    public isOpen = false;


    toggleCollapseArea(): void{
        this.isOpen = !this.isOpen;
    }
}
