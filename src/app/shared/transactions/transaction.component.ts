import {Component, Input} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {Utils} from '@data/static/utils';

@Component({
  selector: 'app-transaction-link',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})

export class TransactionComponent {
  @Input() transactionHash;
  @Input() network;

  constructor(public vt: ViewTypeService) {
  }

  viewNetworkscanTransaction(): void {
    Utils.openNetworkScanTx(this.transactionHash, this.network);
  }
}
