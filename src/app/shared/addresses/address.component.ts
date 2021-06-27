import {Component, Input} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';

@Component({
  selector: 'app-address-link',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

export class AddressComponent {
  @Input() contract: { network: string; address: string };

  constructor(public vt: ViewTypeService) {
  }

  viewNetworkAddress(): void {
    if (this.contract.network === 'bsc') {
      window.open('https://www.bscscan.com/address/' + this.contract.address, '_blank');
    } else {
      window.open('https://etherscan.io/address/' + this.contract.address, '_blank');
    }
  }
}
