import {Component, Input, OnInit} from '@angular/core';
import {HarvestDto} from '../../../models/harvest-dto';
import {Utils} from '../../../static/utils';
import {Vault} from '../../../models/vault';
import {ContractsService} from '../../../services/contracts.service';
import { ViewTypeService } from 'src/app/services/view-type.service';

@Component({
  selector: 'app-harvest-trade',
  templateUrl: './harvest-trade.component.html',
  styleUrls: ['./harvest-trade.component.scss']
})
export class HarvestTradeComponent implements OnInit {

  constructor(
    private contractService: ContractsService,
    public vt: ViewTypeService
    ) {
  }

  @Input() dto: HarvestDto;
  @Input() fullDate = false;
  openModal = false;

  ngOnInit(): void {
  }

  showTradeLinks(): void {
    this.openModal = !this.openModal;
  }

  hideTradeLinks(show: boolean): void {
    this.openModal = show;
  }

  priceGradientLight(type: string, amount: number, success: boolean): string {
    return Utils.priceGradientHarvest(type, amount, success);
  }

  get vaultModel() {
    return this.contractService.getContracts(Vault).get(this.dto.vaultAddress);
  }
}
