import { Contract } from 'web3-eth-contract';
import { Injectable } from '@angular/core';
import { Vault } from '@data/models/vault';
import { Pool } from '@data/models/pool';
import BigNumber from 'bignumber.js';
import { BigNumberZero } from '@data/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  public calcUnderlying(vault?: Vault, pool?: Pool): string | undefined {
    if (vault) {
      return vault.underlying?.address;
    }
    return pool?.lpToken?.address;
  }
  
  public async calcUnderlyingPrice(
    poolBalance: string | null,
    priceAddress: string | undefined,
    getPrice: (priceAddress: string) => Promise<BigNumber | null>,
  ): Promise<BigNumber | null> {
    if (!poolBalance) {
      return null;
    }
    
    if (poolBalance === '0') {
      return BigNumberZero;
    }

    return priceAddress ? await getPrice(priceAddress) : null;
  }
  
  public async makeRequest(
    contract: Contract,
    methodName: string,
    ...args: any[]
  ): Promise<string | null> {
    try {
      return await contract.methods[methodName](
        ...args,
      ).call();
    } catch (error) {
      console.log(
        `An error occurred while calling blockchain method: ${ methodName }. ` +
        // @ts-ignore
        `Contract address: ${ contract?._address }. ${ error }`,
      );
      return Promise.resolve(null);
    }
  }
}
