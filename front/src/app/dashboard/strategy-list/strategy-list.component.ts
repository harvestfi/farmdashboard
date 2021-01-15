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

  get vaultsListCrv(): string[] {
    return StaticValues.strategiesListCurve;
  }

  get vaultsListCrypto(): string[] {
    return StaticValues.strategiesListSingleCoins;
  }

  get vaultsListUniLpPools(): string[] {
    return StaticValues.strategiesListUniLpPools;
  }

  get vaultsListNonUniLpPools(): string[] {
    return StaticValues.strategiesListNonUniLpPools;
  }

  ngOnInit(): void {
  }

}
