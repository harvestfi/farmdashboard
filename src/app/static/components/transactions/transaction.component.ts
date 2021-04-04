import {Component, Input} from '@angular/core';
import {ViewTypeService} from '../../../services/view-type.service';

@Component({
    selector: 'app-transaction-link',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
})

export class TransactionComponent {
    @Input() transactionHash;

    constructor(public vt: ViewTypeService) {}

    viewEtherscanTransaction(): void {
        window.open('https://etherscan.io/tx/' + this.transactionHash, '_blank');
    }
}
