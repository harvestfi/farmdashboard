import {Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';

@Component({
    selector: 'app-transaction-link',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
})

export class TransactionComponent {
    @Input() transactionHash;
    @Input() transactionNetwork;

    constructor(public vt: ViewTypeService) {}

    viewNetworkscanTransaction(): void {
        if (this.transactionNetwork === 'bsc') {
            window.open('https://www.bscscan.com/tx/' + this.transactionHash, '_blank');
        } else {
            window.open('https://etherscan.io/tx/' + this.transactionHash, '_blank');
        }

    }
}
