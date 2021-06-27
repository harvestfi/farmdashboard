import {Component, Input, OnInit} from '@angular/core';
import {Utils} from '@data/static/utils';
import {HarvestDto} from '@data/models/harvest-dto';
import {TransferDto} from '@data/models/transfer-dto';
import {NGXLogger} from 'ngx-logger';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';

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
  addresses: Map<string, string>;
  vaults: Map<string, Vault>;

  constructor(private log: NGXLogger, private contractsService: ContractsService) {
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
    this.vaults = this.contractsService.getContracts(Vault);
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

  getTransferOtherSideVault(): Vault {
    return this.contractsService.getContracts(Vault).get(this.getTransferOtherSide());
  }

  getHarvestVault(): Vault {
    return this.contractsService.getContracts(Vault).get(this.harvestDto.vaultAddress);
  }

  getTransferOtherSidePretty(): string {
    const otherSide = this.getTransferOtherSide();
    let name = this.vaults.get(otherSide)?.contract.name || otherSide;
    if (name === otherSide) {
      name = name.slice(0, 6) + '..' + name.slice(name.length - 4);
    }
    return name;
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
