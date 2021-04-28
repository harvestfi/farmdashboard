import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Vault} from '../../models/vault';

@Component({
  selector: 'app-apy-window',
  templateUrl: './apy-window.component.html',
  styleUrls: ['./apy-window.component.scss']
})
export class ApyWindowComponent implements OnInit {
  @Output() showModal = new EventEmitter<boolean>();
  @Input() vault: Vault;

  constructor() {
  }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.showModal.emit(false);
  }
}
