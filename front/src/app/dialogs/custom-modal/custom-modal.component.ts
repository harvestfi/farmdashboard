import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit {
  showModal: boolean;
  @Input() hash: string;
  @Input() owner: string;
  @Input() date: string;


  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.showModal = false;
  }

}

