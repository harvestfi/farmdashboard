import { Component, ElementRef, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CustomModalService } from './custom-modal.service';

@Component({
    selector: 'app-custom-modal',
    templateUrl: './custom-modal.component.html',
    styleUrls: ['./custom-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomModalComponent implements AfterViewInit {
    @Input() id: string;
    private htmlElement: HTMLElement;
    isModalOpened = false;
    constructor(private el: ElementRef, private modalService: CustomModalService){
        this.htmlElement = el.nativeElement;
    }
    ngAfterViewInit(): void {
        if(!this.id){
            console.error('Please provide a modal id');
            return;
        }

        document.body.append(this.htmlElement);

        this.htmlElement.addEventListener('click', (e: Record<any, any>) =>{
            if(e.target.className.includes('custom-modal-container')){
                this.closeModal();
            }
        })
        this.modalService.addModal(this);
    }
    

    ngOnDestroy(): void {
        this.modalService.removeModal(this.id);
        this.htmlElement.remove();
    }


    openModal(): void {
        this.htmlElement.style.visibility = 'visible';
        document.body.classList.add('custom-modal-open');
        this.isModalOpened = true;
    }
    
    closeModal(): void {
        this.htmlElement.style.visibility = 'hidden';
        document.body.classList.remove('custom-modal-open')
        this.isModalOpened = false;
    }

    toggleModal(): void{
        this.isModalOpened = !this.isModalOpened;
    }
}