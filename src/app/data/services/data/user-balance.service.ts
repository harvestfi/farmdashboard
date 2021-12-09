import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { AssetsInfo } from '@data/models/assets-info';
import { EthereumService } from '@data/services/data/ethereum.service';
import { BlockchainService } from '@data/services/data/blockchain.service';
import { HttpService } from '@data/services/http/http.service';
import { map } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import { Addresses } from '@data/static/addresses';
import { ContractsApiService } from '@data/services/http/contracts-api.service';

const farmAddress = Addresses.ADDRESSES.get('FARM');

@Injectable({
  providedIn: 'root',
})
export class UserBalanceService {
  constructor(
    private ethereumService: EthereumService,
    private blockchainService: BlockchainService,
    private ethereumApiService: ContractsApiService,
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
  
  getAssets(address): Observable<Promise<AssetsInfo[]>> {
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
}
