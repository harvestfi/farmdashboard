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
    isModalOpened = true;
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
        this.htmlElement.style.display = 'block';
        document.body.classList.add('custom-modal-open');
    }

    closeModal(): void {
        this.htmlElement.style.display = 'none';
        document.body.classList.remove('custom-modal-open')
    }

    toggleModal(): void{
        console.log('sada');
        this.isModalOpened = !this.isModalOpened;
    }
}