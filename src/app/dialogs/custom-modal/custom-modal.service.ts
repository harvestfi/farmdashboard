import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CustomModalService {
    private modals: any[] = [];

    addModal(modal: any): void {
        this.modals.push(modal);
    }

    removeModal(modalID: string): void {
        this.modals = this.modals.filter(modal => modal.id !== modalID);
    }

    openModal(modalID: string): void {
        const modal = this.modals.find(modal => modal.id === modalID);
        modal.openModal();
    }
    
    closeModal(modalID: string): void {
        const modal = this.modals.find(modal => modal.id === modalID);
        modal.closeModal();
    }
}