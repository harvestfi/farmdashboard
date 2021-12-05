import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import {
  BigNumberOne,
  BigNumberZero,
  ERC20_ABI_GET_PRICE_PER_FULL_SHARE,
  ETH_ORACLE_ABI_FOR_GETTING_PRICES,
  ETH_WEB3,
  ETHEREUM_CONTRACT_FOR_GETTING_PRICES,
  ethereumPoolsWithEarnedMethodTaking2Arguments,
  FARM_DECIMALS,
  FARM_VAULT_ABI,
  farmAddress,
  FTOKEN_ABI,
  POOL_WITH_EARNED_METHOD_WITH_2_ARGUMENTS,
  PRICE_DECIMALS,
  PS_VAULT_ABI,
  PSAddress,
  REWARDS_ABI,
  vaultsWithoutReward,
} from '@data/constants/app.constant';
import { BlockchainService } from '@data/services/data/blockchain.service';
import { Pool } from '@data/models/pool';
import { Vault } from '@data/models/vault';
import { AssetsInfo, ETH, PartialAssetData } from '@data/models/assets-info';
import { Utils } from '@data/static/utils';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  constructor(private blockchainService: BlockchainService) {
  }
  
  public async getPrice(
    tokenAddress: string,
  ): Promise<BigNumber | null> {
    const gettingPricesContract = new ETH_WEB3.eth.Contract(
      ETH_ORACLE_ABI_FOR_GETTING_PRICES,
      ETHEREUM_CONTRACT_FOR_GETTING_PRICES,
    );
    
    const price: string | null = await this.blockchainService.makeRequest(
      gettingPricesContract,
      'getPrice',
      tokenAddress,
    );

    return price
      ? new BigNumber(price).dividedBy(10 ** PRICE_DECIMALS)
      : null;
  }
  
  public async getEarned(
    walletAddress: string,
    poolContract: Contract,
    web3: Web3,
    poolAddress: string,
  ): Promise<string | null> {
    const poolContractHavingTwoArguments = new web3.eth.Contract(
      POOL_WITH_EARNED_METHOD_WITH_2_ARGUMENTS,
      poolAddress,
    );
    
    let earned: string | null = '';
    
    if (
      ethereumPoolsWithEarnedMethodTaking2Arguments.has(
        poolAddress.toLocaleLowerCase(),
      )
    ) {
      return await this.blockchainService.makeRequest(
        poolContractHavingTwoArguments,
        'earned',
        0,
        walletAddress,
      );
    }
    
    earned = await this.blockchainService.makeRequest(
      poolContract,
      'earned',
      walletAddress,
    );
    
    if (earned === null) {
      earned = await this.blockchainService.makeRequest(
        poolContractHavingTwoArguments,
        'earned',
        0,
        walletAddress,
      );
    }
    
    return earned;
  }
  
  public calcRewardTokenAreInFARM(
    rewardIsFarm: boolean,
    prettyRewardPricePerFullShare: BigNumber | null,
    prettyRewardTokenBalance: BigNumber | null,
  ): BigNumber | null {
    if (rewardIsFarm) {
      return prettyRewardTokenBalance;
    }
    return prettyRewardTokenBalance && prettyRewardPricePerFullShare
      ? prettyRewardTokenBalance.multipliedBy(prettyRewardPricePerFullShare)
      : null;
  }
  
  public async getAssetsFromPool(
    pool: Pool,
    walletAddress: string,
    farmPrice: BigNumber | null,
    partialAssetData: PartialAssetData,
    relatedVault?: Vault,
  ): Promise<AssetsInfo> {
    const lpTokenContract = new ETH_WEB3.eth.Contract(
      FTOKEN_ABI,
      pool.lpToken?.address,
    );
    
    const poolContract = new ETH_WEB3.eth.Contract(
      REWARDS_ABI,
      pool.contract.address,
    );
    // Pool where reward is iFarm
    const iFarmRewardPool = new ETH_WEB3.eth.Contract(
      ERC20_ABI_GET_PRICE_PER_FULL_SHARE,
      pool.rewardToken?.address,
    );
    
    const rewardIsFarm = pool.rewardToken?.address.toLowerCase() === farmAddress;
    
    const priceAddress = relatedVault
      ? relatedVault.underlying?.address
      : pool.lpToken?.address;
    /**
     * lpTokenBalance - balance of a wallet in the liquidity-pool
     * reward - reward of a wallet in the pool
     */
    const [lpTokenBalance, poolBalance, reward] = await Promise.all<string | null,
      string | null,
      string | null>([
      this.blockchainService.makeRequest(
        lpTokenContract,
        'balanceOf',
        walletAddress,
      ),
      this.blockchainService.makeRequest(poolContract, 'balanceOf', walletAddress),
      this.getEarned(
        walletAddress,
        poolContract,
        ETH_WEB3,
        pool.contract.address,
      ),
    ]);
    
    const prettyRewardTokenBalance: BigNumber | null = reward
      ? new BigNumber(reward).dividedBy(10 ** FARM_DECIMALS)
      : null;
    
    // should the method be called?
    const shouldGetPricePerFullShareBeCalled: boolean =
      !!prettyRewardTokenBalance &&
      !!prettyRewardTokenBalance.toNumber() &&
      !rewardIsFarm;
    
    const getDecimals = async () => {
      if (relatedVault && relatedVault.decimals) {
        return relatedVault.decimals;
      }
      return lpTokenBalance !== '0' || poolBalance !== '0'
        ? await this.blockchainService.makeRequest(lpTokenContract, 'decimals')
        : null;
    };
    
    /**
     * underlyingPrice - the price are in USD
     * iFarmPricePerFullShare = (iFARMPrice / farmPrice) * 10 ** rewardDecimals
     * poolTotalSupply - the total number of tokens in the pool of all participants
     * poolBalance - balance of a wallet in the pool (are in fToken)
     * pricePerFullShareLpToken = (nativeToken / fToken ) * 10 ** lpTokenDecimals
     */
    const [
      underlyingPrice,
      iFarmPricePerFullShare,
      poolTotalSupply,
      pricePerFullShareLpToken,
      lpTokenDecimals,
    ] = await Promise.all<BigNumber | null,
      string | null,
      string | null,
      string | null,
      number | string | null>([
      // EthereumService.calcUnderlyingPrice(poolBalance, priceAddress),
      this.blockchainService.calcUnderlyingPrice(
        poolBalance,
        priceAddress,
        this.getPrice.bind(this),
      ),
      
      shouldGetPricePerFullShareBeCalled
        ? this.blockchainService.makeRequest(iFarmRewardPool, 'getPricePerFullShare')
        : null,
      
      poolBalance !== '0'
        ? poolContract.methods.totalSupply().call()
        : BigNumberOne,
      
      relatedVault && poolBalance !== '0'
        ? lpTokenContract.methods.getPricePerFullShare().call()
        : null,
      
      getDecimals(),
    ]);
    
    const prettyLpTokenBalance =
      lpTokenDecimals && lpTokenBalance
        ? new BigNumber(lpTokenBalance).dividedBy(10 ** Number(lpTokenDecimals))
        : null;
    
    const prettyPoolBalance =
      lpTokenDecimals && poolBalance
        ? new BigNumber(poolBalance).dividedBy(10 ** Number(lpTokenDecimals))
        : null;
    
    const prettyPricePerFullShareLpToken =
      pricePerFullShareLpToken && lpTokenDecimals
        ? new BigNumber(pricePerFullShareLpToken).dividedBy(
          10 ** Number(lpTokenDecimals),
        )
        : 1;
    
    const prettyRewardPricePerFullShare = iFarmPricePerFullShare
      ? new BigNumber(iFarmPricePerFullShare).dividedBy(10 ** FARM_DECIMALS)
      : null;
    
    const rewardTokenAreInFARM = this.calcRewardTokenAreInFARM(
      rewardIsFarm,
      prettyRewardPricePerFullShare,
      prettyRewardTokenBalance,
    );
    
    const percentOfPool =
      poolBalance && poolTotalSupply
        ? new BigNumber(poolBalance)
          .dividedBy(new BigNumber(poolTotalSupply))
          .multipliedBy(100)
        : null;
    
    // fTokens balance in underlying Tokens;
    const underlyingBalance = prettyPoolBalance
      ? prettyPoolBalance.multipliedBy(prettyPricePerFullShareLpToken)
      : null;
    
    const name = relatedVault
      ? relatedVault.contract.name || 'no name'
      : pool.contract.name || 'no name';
    
    const prettyName = relatedVault
      ? Utils.contractToName(relatedVault.contract)
      : Utils.contractToName(pool.contract);
    
    const id =
      pool.contract?.address || (relatedVault?.contract?.address as string);
    
    const calculatedValue = this.calcValue(
      underlyingPrice,
      rewardTokenAreInFARM,
      farmPrice,
      prettyPoolBalance,
      prettyPricePerFullShareLpToken,
    );
    
    return {
      id,
      name,
      network: ETH,
      prettyName,
      earnFarm: !vaultsWithoutReward.has(id),
      farmToClaim: rewardTokenAreInFARM,
      stakedBalance: prettyPoolBalance,
      percentOfPool,
      value: calculatedValue,
      unstakedBalance: prettyLpTokenBalance,
      address: {
        vault: relatedVault?.contract?.address,
        pool: pool.contract?.address,
      },
      underlyingBalance,
      ...partialAssetData,
    };
  }
  
  /** All account assets that contains in the pool are in USD */
  private calcValue(underlyingPrice, rewardTokenAreInFARM, farmPrice, prettyPoolBalance, prettyPricePerFullShareLpToken): BigNumber | null {
    return underlyingPrice !== null &&
    underlyingPrice.toString() !== '0' &&
    rewardTokenAreInFARM !== null &&
    // farmPrice !== null &&
    prettyPoolBalance
      ? underlyingPrice
        .multipliedBy(prettyPoolBalance)
        .multipliedBy(prettyPricePerFullShareLpToken)
        .plus(farmPrice?.multipliedBy(rewardTokenAreInFARM) || 0)
      : null;
  };
  
  public getAssetsFromVaults(
    vaults: Vault[],
    pools: Pool[],
    walletAddress: string,
    farmPrice: BigNumber | null,
  ): Promise<AssetsInfo>[] {
    return vaults.map(async (vault: Vault) => {
      // is this Vault iFarm?
      const isIFarm = vault.contract.address.toLowerCase() === '0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651'.toLowerCase();
      
      // is this Vault PS?
      const isPS = vault.contract.address.toLowerCase() === PSAddress;
      
      // a pool that has the same token as a vault
      const vaultRelatedPool: Pool | undefined = pools.find(pool => {
        return vault.contract?.address?.toLowerCase() === pool.lpToken?.address?.toLowerCase();
      });
      
      const partialAssetData = {
        underlyingAddress: this.blockchainService.calcUnderlying(
          vault,
          vaultRelatedPool,
        ),
      };
      
      const vaultContract = new ETH_WEB3.eth.Contract(
        FTOKEN_ABI,
        vault.contract.address,
      );
      
      if (vaultRelatedPool) {
        return this.getAssetsFromPool(
          vaultRelatedPool,
          walletAddress,
          farmPrice,
          partialAssetData,
          vault,
        );
      }
      // Case 4: Vault it is iFarm.
      if (isIFarm) {
        const farmContract = new ETH_WEB3.eth.Contract(
          FARM_VAULT_ABI,
          vault.underlying!.address,
        );
        
        const [
          vaultBalance,
          farmBalance,
          totalSupply,
          underlyingBalanceWithInvestmentForHolder,
          pricePerFullShare,
        ] = await Promise.all<string | null,
          string | null,
          string | null,
          string | null,
          string | null>([
          this.blockchainService.makeRequest(
            vaultContract,
            'balanceOf',
            walletAddress,
          ),
          this.blockchainService.makeRequest(
            farmContract,
            'balanceOf',
            walletAddress,
          ),
          this.blockchainService.makeRequest(vaultContract, 'totalSupply'),
          this.blockchainService.makeRequest(
            vaultContract,
            'underlyingBalanceWithInvestmentForHolder',
            walletAddress,
          ),
          this.blockchainService.makeRequest(vaultContract, 'getPricePerFullShare'),
        ]);
        
        const prettyFarmBalance: BigNumber | null = farmBalance
          ? new BigNumber(farmBalance).dividedBy(10 ** FARM_DECIMALS)
          : null;
        
        const prettyVaultBalance: BigNumber | null = vaultBalance
          ? new BigNumber(vaultBalance).dividedBy(10 ** vault.decimals!)
          : null;
        
        const prettyUnderlyingBalanceWithInvestmentForHolder =
          underlyingBalanceWithInvestmentForHolder
            ? new BigNumber(underlyingBalanceWithInvestmentForHolder)
            : null;
        
        const prettyPricePerFullShare: BigNumber | null =
          pricePerFullShare && vault
            ? new BigNumber(pricePerFullShare).dividedBy(10 ** vault.decimals!)
            : null;
        
        const value: BigNumber | null =
          farmPrice !== null &&
          prettyUnderlyingBalanceWithInvestmentForHolder &&
          vault
            ? prettyUnderlyingBalanceWithInvestmentForHolder
              .multipliedBy(farmPrice)
              .dividedBy(10 ** vault.decimals!)
            : null;
        
        const percentOfPool: BigNumber | null =
          vaultBalance && totalSupply
            ? new BigNumber(vaultBalance)
              .dividedBy(new BigNumber(totalSupply))
              .multipliedBy(new BigNumber(100))
            : null;
        
        const underlyingBalance: BigNumber | null =
          prettyVaultBalance && prettyPricePerFullShare
            ? prettyVaultBalance.multipliedBy(prettyPricePerFullShare)
            : null;
        
        const address = vault.contract.address;
        
        return {
          id: address,
          // typescript bug
          network: ETH as typeof ETH,
          name: Utils.contractToName(vault.contract),
          prettyName: Utils.contractToName(vault.contract),
          earnFarm: true,
          farmToClaim: BigNumberZero,
          stakedBalance: prettyVaultBalance,
          percentOfPool,
          value,
          unstakedBalance: prettyFarmBalance,
          address: { vault: address },
          underlyingBalance,
          ...partialAssetData,
        };
      }
      
      // Case 5: Vault it is PS.
      if (isPS) {
        const farmContract = new ETH_WEB3.eth.Contract(
          FARM_VAULT_ABI,
          farmAddress,
        );
        
        const PSvaultContract = new ETH_WEB3.eth.Contract(
          PS_VAULT_ABI,
          vault.contract.address,
        );
        
        const [vaultBalance, farmBalance] = await Promise.all<string | null,
          string | null>([
          this.blockchainService.makeRequest(
            PSvaultContract,
            'balanceOf',
            walletAddress,
          ),
          this.blockchainService.makeRequest(
            farmContract,
            'balanceOf',
            walletAddress,
          ),
        ]);
        
        const totalValue: string | null =
          vaultBalance && vaultBalance !== '0'
            ? await this.blockchainService.makeRequest(PSvaultContract, 'totalValue')
            : null;
        
        const percentOfPool =
          totalValue && vaultBalance
            ? new BigNumber(vaultBalance)
              .dividedBy(new BigNumber(totalValue))
              .multipliedBy(100)
            : BigNumberZero;
        
        const prettyVaultBalance = vaultBalance
          ? new BigNumber(vaultBalance).dividedBy(10 ** vault.decimals!)
          : null;
        
        const prettyFarmBalance = farmBalance
          ? new BigNumber(farmBalance).dividedBy(10 ** FARM_DECIMALS)
          : null;
        
        const value: BigNumber | null =
          prettyVaultBalance && farmPrice
            ? prettyVaultBalance.multipliedBy(farmPrice)
            : null;
        
        const address = vault.contract.address;
        
        return {
          id: address,
          // typescript bug
          network: ETH as typeof ETH,
          underlying: vault.underlying?.address,
          name: Utils.contractToName(vault.contract),
          prettyName: Utils.contractToName(vault.contract),
          earnFarm: !vaultsWithoutReward.has(Utils.contractToName(vault.contract)),
          farmToClaim: BigNumberZero,
          stakedBalance: prettyVaultBalance,
          percentOfPool,
          value,
          unstakedBalance: prettyFarmBalance,
          address: { vault: address },
          underlyingBalance: prettyVaultBalance,
          ...partialAssetData,
        };
      }
      
      // Case: vault without pool
      const vaultBalance: string = await vaultContract.methods
        .balanceOf(walletAddress)
        .call();
      
      const prettyVaultBalance = vault.decimals
        ? new BigNumber(vaultBalance).dividedBy(10 ** vault.decimals)
        : null;
      
      const address = vault.contract.address;
      
      return {
        id: address,
        // typescript bug
        network: ETH as typeof ETH,
        name: `${ vault.contract.name } (has not pool)`,
        prettyName: Utils.contractToName(vault.contract),
        earnFarm: !vaultsWithoutReward.has(vault.contract.address),
        farmToClaim: BigNumberZero,
        stakedBalance: BigNumberZero,
        percentOfPool: BigNumberZero,
        value: null,
        unstakedBalance: prettyVaultBalance,
        address: { vault: vault.contract.address },
        underlyingBalance: prettyVaultBalance,
        ...partialAssetData,
      };
    });
  }
}
