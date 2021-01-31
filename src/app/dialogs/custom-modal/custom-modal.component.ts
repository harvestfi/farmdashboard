import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
    selector: 'app-custom-modal',
    templateUrl: './custom-modal.component.html',
    styleUrls: ['./custom-modal.component.css'],
    animations: [
        trigger('openModal', [
            state('open', style({
                opacity: 1
            })),
            state('closed', style({
                opacity: 0
            })),
            transition('open => closed', [
                animate('0.5s')
            ]),
            transition('closed => open', [
                animate('0.45s')
            ]),
        ]),
    ]
})
export class CustomModalComponent {
    isModalOpened = true;
    constructor(){
        
    }

    toggleModal(): void{
        this.isModalOpened = !this.isModalOpened;
    }
}