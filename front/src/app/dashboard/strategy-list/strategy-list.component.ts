import {Component, OnInit} from '@angular/core';
import {StaticValues} from '../../static-values';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.css']
})
export class StrategyListComponent implements OnInit {

  constructor(public vt: ViewTypeService) {
  }

  get vaultsList(): string[] {
    return StaticValues.currentVaults;
  }

  get vaultsListStable(): string[] {
    return StaticValues.strategiesListStablecoins;
  }

  get vaultsListCrv(): string[] {
    return StaticValues.strategiesListCurve;
  }

  get vaultsListCrypto(): string[] {
    return StaticValues.strategiesListCrypto;
  }

  get vaultsListLpPools(): string[] {
    return StaticValues.strategiesListLpPools;
  }

  ngOnInit(): void {
  }

}
