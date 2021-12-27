import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { DestroyService } from '@data/services/destroy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserBalanceService } from '@data/services/data/user-balance.service';
import { AssetsInfo } from '@data/models/assets-info';
import BigNumber from 'bignumber.js';
import { Utils } from '@data/static/utils';
import { ViewTypeService } from '@data/services/view-type.service';
import { EthereumApiService } from '@data/services/http/ethereum-api.service';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

const CURRENCY_VALUE = 'USD';

@Component({
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'g-flex-column',
  },
})
export class UserStatsComponent implements OnInit {
  stakedBalance = '';
  farmPrice = '';
  totalProfit = '';
  personalGasSaved = '';
  apy = '';
  nonZeroAssets: AssetsInfo[] = [];
  isLoadingAssets = false;
  isLoadingFarmPrice = false;
  isLoadingTotalProfit = false;
  isLoadingPersonalGasSaved = true;
  isLoadingApy = true;
  sortField = null;
  sortDirection = -1;
  isPhoneSize = false;
  address: string;
  addressControl: FormControl = new FormControl(null, [
    Validators.required,
    Validators.pattern(/^0x[a-fA-F0-9]{35,45}$/),
  ]);
  
  private exchangeRates = {
    values: { USD: 1 },
    lastUpdatedAt: 0,
  };
  
  private currentExchangeRate: number;
  
  @HostListener('window:resize')
  handleScreenResize(): void {
    const newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    this.isPhoneSize = newWidth < 600;
  }
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private destroy$: DestroyService,
    private userBalanceService: UserBalanceService,
    private contractsApiService: EthereumApiService,
    public viewTypeService: ViewTypeService,
  ) {
  }
  
  ngOnInit(): void {
    this.currentExchangeRate = this.exchangeRates.values[CURRENCY_VALUE];
    
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ address }) => {
        if (!address) {
          return;
        }
        
        this.address = address;
        
        this.addressControl.setValue(address, { emitEvent: false });
        
        this.updateData(this.address);
      });
    
    this.handleScreenResize();
  }
  
  onSort(field: string): void {
    this.sortField = field;
    this.sortDirection = this.sortDirection * (-1);
    
    this.nonZeroAssets.sort((a, b) => {
      const propA = BigNumber.isBigNumber(a[field]) ? a[field]?.toNumber() || '' : a[field]?.toLowerCase() || '';
      const propB = BigNumber.isBigNumber(b[field]) ? b[field]?.toNumber() || '' : b[field]?.toLowerCase() || '';
      
      if (propA > propB) {
        return this.sortDirection;
      }
      
      if (propB > propA) {
        return -1 * this.sortDirection;
      }
      
      return 0;
    });
  }
  
  onReload() {
    this.address = this.addressControl.value;
    
    this.changeDetectorRef.detectChanges();
    
    this.router.navigate(['user-stats', this.address]);
    
    this.updateData(this.address);
  }
  
  private updateData(address: string): void {
    this.isLoadingFarmPrice = true;
    this.isLoadingAssets = true;
    this.isLoadingTotalProfit = true;
  
    this.changeDetectorRef.detectChanges();
    
    forkJoin([
      this.userBalanceService.getEthAssets(address),
      this.userBalanceService.getBscAssets(address),
      this.userBalanceService.getMaticAssets(address),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data: [Promise<AssetsInfo[]>, Promise<AssetsInfo[]>, Promise<AssetsInfo[]>]) => {
        const [eth, bsc, matic] = await Promise.all(data);
        
        this.nonZeroAssets = [...eth, ...bsc, ...matic];
        
        const total = this.nonZeroAssets.reduce((acc: BigNumber, currentAsset: AssetsInfo) => {
          const currentAssetValue = currentAsset.value ?? new BigNumber(0);
          return acc.plus(currentAssetValue);
        }, new BigNumber(0)).toNumber();
        
        this.stakedBalance = Utils.prettyCurrency(total, CURRENCY_VALUE, this.currentExchangeRate);
        
        this.isLoadingAssets = false;
        
        this.nonZeroAssets = this.nonZeroAssets.map(asset => {
          const icon = `/assets/icons/vaults/${ asset.name
            .replace(/^V_/, '')
            .replace(/^P_[f]?/, '')
            .replace(/_#V\d$/, '') }.png`;
          
          const prettyFarmToClaim = asset.farmToClaim
            ? asset.farmToClaim.toFixed(4)
            : '-';
          
          const prettyPercentOfPool = asset.percentOfPool
            ? `${ asset.percentOfPool.toFixed(4) }%`
            : '-';
          
          const prettyValue: string = asset.value
            ? Utils.prettyCurrency(asset.value.toNumber(), CURRENCY_VALUE, this.currentExchangeRate)
            : '-';
          
          const prettyStakedBalance: string = asset.stakedBalance
            ? Utils.prettyNumber(asset.stakedBalance.toNumber())
            : '-';
          
          const prettyUnderlyingBalance: string = asset.underlyingBalance
            ? Utils.prettyNumber(asset.underlyingBalance.toNumber())
            : '-';
          
          const prettyUnstakedBalance: string = asset.unstakedBalance
            ? Utils.prettyNumber(asset.unstakedBalance.toNumber())
            : '-';
          
          return {
            ...asset,
            icon,
            prettyFarmToClaim,
            prettyPercentOfPool,
            prettyValue,
            prettyStakedBalance,
            prettyUnderlyingBalance,
            prettyUnstakedBalance,
          };
        });
        
        this.onSort('prettyName');
        
        this.changeDetectorRef.detectChanges();
      });
    
    this.userBalanceService.getFarmPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe(farmPrice => {
        this.farmPrice = Utils.prettyCurrency(farmPrice.toNumber(), CURRENCY_VALUE, this.currentExchangeRate);
        
        this.isLoadingFarmPrice = false;
        
        this.changeDetectorRef.detectChanges();
      });
    
    this.userBalanceService.getTotalProfit(this.address)
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalProfit => {
        this.totalProfit = totalProfit ? Utils.prettyNumber(+totalProfit) : '-';
  
        this.isLoadingTotalProfit = false;
  
        this.changeDetectorRef.detectChanges();
      });
    
    this.contractsApiService.getPersonalGasSaved(address)
      .pipe(takeUntil(this.destroy$))
      .subscribe(personalGasSaved => {
        this.personalGasSaved = Utils.prettyCurrency(personalGasSaved, CURRENCY_VALUE, this.currentExchangeRate);
        
        this.isLoadingPersonalGasSaved = false;
        
        this.changeDetectorRef.detectChanges();
      });
    
    this.contractsApiService.getAPY()
      .pipe(takeUntil(this.destroy$))
      .subscribe(apy => {
        this.apy = apy && apy !== '0' ? `${ apy }%` : '-';
        
        this.isLoadingApy = false;
        
        this.changeDetectorRef.detectChanges();
      });
  }
}
