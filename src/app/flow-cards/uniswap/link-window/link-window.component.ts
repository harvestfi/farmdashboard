import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-link-window',
  templateUrl: './link-window.component.html',
  styleUrls: ['./link-window.component.css']
})
export class LinkWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() hash: string;
  @Input() owner: string;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.showModal.emit(false);
  }
}
