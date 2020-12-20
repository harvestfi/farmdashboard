import {Component, Input, OnInit} from '@angular/core';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {MatDialog} from '@angular/material/dialog';
import {TvlDialogComponent} from '../../dialogs/tvl-dialog/tvl-dialog.component';
import {ViewTypeService} from '../../services/view-type.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {Utils} from '../../utils';
import {IncomeDialogComponent} from '../../dialogs/income-dialog/income-dialog.component';

@Component({
  selector: 'app-tvl-box',
  templateUrl: './tvl-box.component.html',
  styleUrls: ['./tvl-box.component.css']
})
export class TvlBoxComponent implements OnInit {
  @Input() tvlName: string;
  @Input() name: string;

  constructor(private pricesCalculationService: PricesCalculationService,
              public vt: ViewTypeService,
              private dialog: MatDialog) {
  }

  get tvls(): Map<string, number> {
    return this.pricesCalculationService.tvls;
  }

  get hardWorks(): Map<string, HardWorkDto> {
    return this.pricesCalculationService.lastHardWorks;
  }

  vaultApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultApr(tvlName));
  }

  vaultApr(tvlName: string): number {
    return Math.max(this.pricesCalculationService.incomeApr(tvlName), 0);
  }

  vaultRewardApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName));
  }

  vaultRewardApr(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardApr(tvlName);
  }

  vaultRewardPeriod(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardPeriod(tvlName);
  }

  vaultReward(tvlName: string): number {
    return this.pricesCalculationService.vaultReward(tvlName);
  }

  get psIncome(): number {
    return this.pricesCalculationService.psIncome();
  }

  get psApy(): number {
    return Utils.aprToApyEveryDayReinvest(this.psApr);
  }

  get psApr(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  get psFarmApy(): number {
    return Utils.aprToApyEveryDayReinvest(this.psFarmApr);
  }

  get psFarmApr(): number {
    return 0;
  }

  get tvlPrettyName(): string {
    return this.tvlName?.replace('SUSHI_', '').replace('UNI_LP_', '');
  }

  public static getImgSrc(name: string): string {
    switch (name) {
      case 'UNI_ETH_DAI_V0':
      case 'UNI_ETH_DAI':
        return '/assets/icons/eth_dai.png';
      case 'UNI_ETH_USDC_V0':
      case 'UNI_ETH_USDC':
        return '/assets/icons/eth_usdc.png';
      case 'UNI_ETH_USDT_V0':
      case 'UNI_ETH_USDT':
        return '/assets/icons/eth_usdt.png';
      case 'UNI_ETH_WBTC_V0':
      case 'UNI_ETH_WBTC':
        return '/assets/icons/eth_btc.svg';
      case 'WETH_V0':
      case 'WETH':
        return '/assets/icons/eth.png';
      case 'USDC_V0':
      case 'USDC':
        return '/assets/icons/usdc.png';
      case 'USDT_V0':
      case 'USDT':
        return '/assets/icons/usdt.png';
      case 'DAI_V0':
      case 'DAI':
        return '/assets/icons/dai.png';
      case 'WBTC_V0':
      case 'WBTC':
        return '/assets/icons/wbtc.png';
      case 'RENBTC_V0':
      case 'RENBTC':
        return '/assets/icons/ren.png';
      case 'CRVRENWBTC_V0':
      case 'CRVRENWBTC':
        return '/assets/icons/btc.png';
      case 'SUSHI_WBTC_TBTC':
        return '/assets/icons/sushi_tbtc.png';
      case 'WBTC_TBTC':
        return '/assets/icons/sushi_tbtc.png';
      case 'YCRV_V0':
      case 'YCRV':
        return '/assets/icons/curve.png';
      case '3CRV':
      case '_3CRV':
        return '/assets/icons/three-pool.png';
      case 'TUSD':
        return '/assets/icons/tusd.png';
      case 'PS_V0':
      case 'PS':
        return '/assets/icons/farm.png';
      case 'CRV_TBTC':
        return '/assets/icons/tbtc-mixed.png';
      case 'CRV_CMPND':
        return '/assets/icons/curve-compound.png';
      case 'CRV_BUSD':
        return '/assets/icons/curve-busd.png';
      case 'CRV_USDN':
        return '/assets/icons/curve-usdn.png';
      case 'SUSHI_ETH_DAI':
        return '/assets/icons/sushi-dai.png';
      case 'SUSHI_ETH_USDC':
        return '/assets/icons/sushi-usdc.png';
      case 'SUSHI_ETH_USDT':
        return '/assets/icons/sushi-usdt.png';
      case 'SUSHI_ETH_WBTC':
        return '/assets/icons/sushi-wbtc.png';
      case 'IDX_ETH_DPI':
        return '/assets/icons/eth_dpi.png';
      case 'CRV_HUSD':
        return '/assets/icons/curve-husd.png';
      case 'CRV_HBTC':
        return '/assets/icons/curve-hbtc.png';
      case 'UNI_LP_USDC_FARM':
        return '/assets/icons/farm-usdc.png';
      case 'UNI_LP_WETH_FARM':
        return '/assets/icons/farm-weth.png';
      case 'UNI_LP_GRAIN_FARM':
        return '/assets/icons/corn.svg';
    }
  }

  ngOnInit(): void {
  }

  getImgSrc(name: string): string {
    return TvlBoxComponent.getImgSrc(name);
  }

  openTvlDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: this.tvlName
      }
    });
  }

  openIncomeDialog(): void {
    this.dialog.open(IncomeDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        title: this.tvlName + ' Income history chart',
        name: this.tvlName
      }
    });
  }

  openPSIncomeDialog(): void {
    this.dialog.open(TvlDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        type: 'income'
      }
    });
  }

  tvlValueGradient(tvlName: string): string {
    const minMax = this.findMinMax(this.tvls.values());
    const alpha = this.percentOfMinMax(this.tvls.get(tvlName), minMax[0], minMax[1] * 0.1);
    return 'rgba(0, 0, 0, ' + alpha + ')';
  }

  incomeVaultValueGradient(tvlName: string): string {
    const prices = [];
    for (const hw of this.hardWorks.values()) {
      prices.push(hw?.shareUsdTotal);
    }
    const minMax = this.findMinMax(prices);
    const alpha = this.percentOfMinMax(this.hardWorks.get(tvlName)?.shareUsdTotal, minMax[0], minMax[1] * 0.03);
    return 'rgba(0, 0, 0, ' + alpha + ')';
  }

  aprIncomeVaultValueGradient(tvlName: string): string {
    const aprs = [];
    for (const hw of this.hardWorks.values()) {
      aprs.push(hw?.apr < 0 ? 0 : hw?.apr);
    }
    const minMax = this.findMinMax(aprs);
    const alpha = this.percentOfMinMax(this.hardWorks.get(tvlName)?.apr, minMax[0], minMax[1] * 0.1);
    return 'rgba(0, 0, 0, ' + alpha + ')';
  }

  private percentOfMinMax(value: number, min: number, max: number): number {
    const floor = 0.7;
    const perc = (value - min) / (max - min);
    if (perc < floor) {
      return floor;
    }
    if (perc > 1) {
      return 1;
    }
    return perc;
  }

  private findMinMax(arr): number[] {
    let min = 9999999999999.0;
    let max = 0.0;
    for (const tvl of arr) {
      if (tvl < min) {
        min = tvl;
      }
      if (tvl > max) {
        max = tvl;
      }
    }
    return [min, max];
  }
}
