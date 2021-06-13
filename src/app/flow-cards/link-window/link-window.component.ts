import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Utils} from '../../static/utils';

@Component({
  selector: 'app-link-window',
  templateUrl: './link-window.component.html',
  styleUrls: ['./link-window.component.css']
})
export class LinkWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() network: string;
  @Input() hash: string;
  @Input() owner: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.showModal.emit(false);
  }

  networkScan(): string {
    return Utils.getNetworkScanUrl(this.network) + '/tx/' + this.hash;
  }
}
