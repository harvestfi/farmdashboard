import {Component, Input, OnInit} from '@angular/core';
import {HardWorkDto} from '@data/models/hardwork-dto';
import {Utils} from '@data/static/utils';
import {ContractsService} from '@data/services/contracts.service';
import {Vault} from '@data/models/vault';

@Component({
  selector: 'app-hardwork-trade',
  templateUrl: './hardwork-trade.component.html',
  styleUrls: ['./hardwork-trade.component.scss']
})
export class HardworkTradeComponent implements OnInit {

  @Input() dto: HardWorkDto;
  @Input() fullDate = false;
  @Input() moreColumns = false;
  @Input() vaultsIconsList;
  openModal = false;
  hash = '';
  name = '';
  network = '';

  constructor(private contractService: ContractsService) {
  }

  ngOnInit(): void {
    HardWorkDto.fillBlockDateAdopted(this.dto);
    const temp = this.dto.id.split('_');
    this.hash = temp[0];
    this.network = this.dto.network;
    this.name = Utils.prettyVaultName(this.dto.vault);
  }

  get vaultModel(): Vault {
    return this.contractService.getContracts(Vault).get(this.dto.vaultAddress);
  }

}
