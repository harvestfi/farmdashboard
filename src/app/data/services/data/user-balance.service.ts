import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { AssetsInfo } from '@data/models/assets-info';
import { EthereumService } from '@data/services/data/ethereum.service';
import { BlockchainService } from '@data/services/data/blockchain.service';
import { map } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import { Addresses } from '@data/static/addresses';
import { EthereumApiService } from '@data/services/http/ethereum-api.service';
import { BscApiService } from '@data/services/http/bsc-api.service';
import { BscService } from '@data/services/data/bsc.service';
import { MaticApiService } from '@data/services/http/matic-api.service';
import { MaticService } from '@data/services/data/matic.service';

const farmAddress = Addresses.ADDRESSES.get('FARM');

@Injectable({
  providedIn: 'root',
})
export class UserBalanceService {
  constructor(
    private blockchainService: BlockchainService,
    private ethereumService: EthereumService,
    private ethereumApiService: EthereumApiService,
    private bscService: BscService,
    private bscApiService: BscApiService,
    private maticService: MaticService,
    private maticApiService: MaticApiService,
  ) {
  }
  
  static async nonZeroAssets(assetsFromVaultsPromises, assetsFromPoolsWithoutVaultsPromises) {
    const assetsDataResolved: AssetsInfo[] = await Promise.all([
      ...assetsFromVaultsPromises,
      ...assetsFromPoolsWithoutVaultsPromises,
    ]);
    
    return assetsDataResolved.filter(asset => {
      return (
        asset.farmToClaim?.toNumber() ||
        asset.stakedBalance?.toNumber() ||
        (asset.value && asset.value.toNumber()) ||
        asset.underlyingBalance?.toNumber()
      );
    });
  }
  
  getFarmPrice(): Observable<BigNumber | null> {
    return from(this.ethereumService.getPrice(farmAddress));
  }
  
  getEthAssets(address): Observable<Promise<AssetsInfo[]>> {
    return forkJoin({
      pools: this.ethereumApiService.getEthereumPools(),
      vaults: this.ethereumApiService.getEthereumVaults(),
      farmPrice: this.ethereumService.getPrice(farmAddress),
    })
      .pipe(
        map(({ pools, vaults, farmPrice }) => {
          const assetsFromVaultsPromises = this.ethereumService.getAssetsFromVaults(
            vaults,
            pools,
            address,
            farmPrice,
          );
          
          const poolsWithoutVaults = pools.filter(pool => {
            return !vaults.find(
              vault => vault.contract.address === pool.lpToken?.address,
            );
          });
          // Case 3: Pool without Vault.
          const assetsFromPoolsWithoutVaultsPromises = poolsWithoutVaults.map(
            pool => {
              const partialAssetData = {
                underlyingAddress: this.blockchainService.calcUnderlying(
                  undefined,
                  pool,
                ),
              };
              return this.ethereumService.getAssetsFromPool(
                pool,
                farmAddress,
                farmPrice,
                partialAssetData,
              );
            },
          );
  
          return UserBalanceService.nonZeroAssets(assetsFromVaultsPromises, assetsFromPoolsWithoutVaultsPromises);
        }),
      );
  }
  
  getBscAssets(address): Observable<Promise<AssetsInfo[]>> {
    return forkJoin({
      pools: this.bscApiService.getBscPools(),
      vaults: this.bscApiService.getBscVaults(),
      farmPrice: this.bscService.getPrice(farmAddress),
    })
      .pipe(
        map(({ pools, vaults, farmPrice }) => {
          const assetsFromVaultsPromises = this.bscService.getAssetsFromVaults(
            vaults,
            pools,
            address,
            farmPrice,
          );
  
          const poolsWithoutVaults = pools.filter(pool => {
            return !vaults.find(
              vault => vault.contract.address === pool.lpToken?.address,
            );
          });
  
          const assetsFromPoolsWithoutVaultsPromises = poolsWithoutVaults.map(
            pool => {
              const partialAssetData = {
                underlyingAddress: this.blockchainService.calcUnderlying(
                  undefined,
                  pool,
                ),
              };
              return this.bscService.getAssetsFromPool(
                pool,
                farmAddress,
                farmPrice,
                partialAssetData,
              );
            },
          );
      
          return UserBalanceService.nonZeroAssets(assetsFromVaultsPromises, assetsFromPoolsWithoutVaultsPromises);
        }),
      );
  }
  
  getMaticAssets(address): Observable<Promise<AssetsInfo[]>> {
    return forkJoin({
      pools: this.maticApiService.getMaticPools(),
      vaults: this.maticApiService.getMaticVaults(),
      farmPrice: this.maticService.getPrice(farmAddress),
    })
      .pipe(
        map(({ pools, vaults, farmPrice }) => {
          const assetsFromVaultsPromises = this.bscService.getAssetsFromVaults(
            vaults,
            pools,
            address,
            farmPrice,
          );
          
          const poolsWithoutVaults = pools.filter(pool => {
            return !vaults.find(
              vault => vault.contract.address === pool.lpToken?.address,
            );
          });
          
          const assetsFromPoolsWithoutVaultsPromises = poolsWithoutVaults.map(
            pool => {
              const partialAssetData = {
                underlyingAddress: this.blockchainService.calcUnderlying(
                  undefined,
                  pool,
                ),
              };
              return this.maticService.getAssetsFromPool(
                pool,
                farmAddress,
                farmPrice,
                partialAssetData,
              );
            },
          );
          
          return UserBalanceService.nonZeroAssets(assetsFromVaultsPromises, assetsFromPoolsWithoutVaultsPromises);
        }),
      );
  }
}
