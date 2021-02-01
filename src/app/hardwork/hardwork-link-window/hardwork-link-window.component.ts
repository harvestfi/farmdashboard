import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-hardwork-link-window',
  templateUrl: './hardwork-link-window.component.html',
  styleUrls: ['./hardwork-link-window.component.css']
})
export class HardworkLinkWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() hash: string;
  constructor() { }

  ngOnInit(): void {

  }
  closeModal(): void {
    this.showModal.emit(false);
  }

}
