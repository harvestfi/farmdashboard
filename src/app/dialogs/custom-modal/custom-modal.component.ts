import { Component, Injectable, Input, OnInit, TemplateRef, ViewChild, ContentChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-custom-modal',
    templateUrl: './custom-modal.component.html',
    styleUrls: ['./custom-modal.component.scss'],
})
@Injectable()
export class CustomModalComponent implements OnInit {
    @ViewChild('modal') private modalContent: TemplateRef<CustomModalComponent>;
    @ContentChild(TemplateRef) template;
    public modalRef: NgbModalRef;
    public modalIsOpen: boolean;
    constructor(private modalService: NgbModal){
    }

    ngOnInit(): void {
    }
    open(): void {
        this.modalRef = this.modalService.open(this.modalContent);
        this.modalIsOpen = true;
    }
    close(): void{
        this.modalIsOpen = false;
        this.modalRef.close();
    }
    dismiss(): void{
        this.modalIsOpen = false;
        this.modalRef.dismiss();
    }
}
