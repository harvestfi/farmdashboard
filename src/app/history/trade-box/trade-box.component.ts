import {Component, Input, OnInit} from '@angular/core';
import {Utils} from '../../static/utils';
import {StaticValues} from '../../static/static-values';
import {HarvestDto} from '../../models/harvest-dto';
import {TransferDto} from '../../models/transfer-dto';
import {NGXLogger} from 'ngx-logger';
import {Addresses} from '../../static/addresses';

@Component({
  selector: 'app-trade-box',
  templateUrl: './trade-box.component.html',
  styleUrls: ['./trade-box.component.css']
})
export class TradeBoxComponent implements OnInit {

  @Input() address: string;
  @Input() transferDto: TransferDto;
  @Input() harvestDto: HarvestDto;
  otherSideAddress: string;
  otherSideName: string;

  constructor(private log: NGXLogger) {
  }

  get getTitle(): string {
    if (this.transferDto) {
      if (this.transferDto.type === 'PS_EXIT' || this.transferDto.type === 'PS_STAKE') {
        return '💳';
      }
      return '💸' + this.transferDirection();
    }
    if (this.isPositive()) {
      return '🏦';
    }
    return '🏦';
  }

  ngOnInit(): void {
    this.otherSideAddress = this.getTransferOtherSide();
    this.otherSideName = this.getTransferOtherSidePretty();
  }

  transferBalance(t: TransferDto): number {
    return Utils.transferBalance(t, this.address);
  }

  isPositive(): boolean {
    if (this.transferDto) {
      return Utils.isTransferPositive(this.transferDto, this.address);
    } else if (this.harvestDto) {
      return Utils.isHarvestPositive(this.harvestDto);
    } else {
      this.log.warn('Not found tx');
    }
  }

  isTrade(): boolean {
    return Utils.isUniTrade(this.transferDto);
  }

  openEtherscanTx(hash: string): void {
    Utils.openEtherscanTx(hash);
  }

  getCoinImgUrl(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  getColor(): string {
    if (this.transferDto && (
        this.transferDto.type === 'PS_EXIT'
        || this.transferDto.type === 'PS_STAKE'
        || this.transferDto.type === 'LP_ADD'
        || this.transferDto.type === 'LP_REM'
    )) {
      return '#000000';
    }
    if (this.isPositive()) {
      return '#478c54';
    }
    return '#c15b5b';
  }

  isUni(): boolean {
    return !this.harvestDto;
  }

  getTransferOtherSide(): string {
    if (!this.transferDto) {
      return '';
    }
    let otherSide: string;
    if (this.address.toLowerCase() === this.transferDto.owner.toLowerCase()) {
      otherSide = this.transferDto.recipient.toLowerCase();
    } else if (this.address.toLowerCase() === this.transferDto.recipient.toLowerCase()) {
      otherSide = this.transferDto.owner.toLowerCase();
    } else {
      this.log.warn('Wrong side');
      return '';
    }
    return otherSide;
  }

  getTransferOtherSidePretty(): string {
    const otherSide = this.getTransferOtherSide();
    let name = Addresses.mapAddressToName(otherSide);
    if (name === otherSide) {
      name = name.slice(0, 6) + '..' + name.slice(name.length - 4);
    }
    return name;
  }

  prettyName(name: string): string {
    return StaticValues.vaultPrettyName(name);
  }

  prettyType(): string {
    return Utils.prettyTransferType(this.transferDto?.type);
  }

  transferDirection(): string {
    if (this.transferDto.type === 'PS_EXIT' || this.transferDto.type === 'PS_STAKE') {
      return '';
    }
    if (this.address.toLowerCase() === this.transferDto.owner.toLowerCase()) {
      return '➡';
    } else {
      return '⬅';
    }
  }
}
