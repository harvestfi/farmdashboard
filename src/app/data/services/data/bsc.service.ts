import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BlockchainService } from '@data/services/data/blockchain.service';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { BSC_ORACLE_ABI } from '@data/static/abi/bsc-oracle.abi';
import { BSC_UNDERLYING_ABI } from '@data/static/abi/bsc-underlying.abi';
import { Pool } from '@data/models/pool';
import { Vault } from '@data/models/vault';
import { AssetsInfo, BSC, PartialAssetData } from '@data/models/assets-info';
import { FTOKEN_ABI } from '@data/static/abi/ftoken.abi';
import { REWARDS_ABI } from '@data/static/abi/rewards.abi';
import { StaticValues } from '@data/static/static-values';

const FARM_DECIMALS = 18;
const PRICE_DECIMALS = 18;
const DEFAULT_BSC_ORACLE_CONTRACT_FOR_GETTING_PRICES = '0x643cF46eef91Bd878D9710ceEB6a7E6F929F2608';
const LEGACY_BSC_ORACLE_CONTRACT_FOR_GETTING_PRICES = '0xE0e9F05054Ad3a2b6414AD13D768be91a84b47e8';
const BSCContractsWithoutFactoryMethod = new Set<string>([
  '0xecf0545684a06a4ea7b9c2fb1b6c08f50436e9db',
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
  '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
]);
const LEGACY_BSC_FACTORY = '0xbcfccbde45ce874adcb698cc183debcf17952812';

type CONTRACTS_FOR_PRICES_KEYS = 'default' | 'legacy'

@Injectable({
  providedIn: 'root',
})
export class BscService {
  private vaultsWithoutReward = new Set<string>([]);
  private bscWeb3: Web3;
  private contractsForPrices: { default: Contract, legacy: Contract };
  
  constructor(private blockchainService: BlockchainService) {
    const bscUrl = StaticValues.NETWORKS.get('bsc').rpcUrl;
    
    this.bscWeb3 = new Web3(bscUrl);
    
    const legacyContractForPrices = new this.bscWeb3.eth.Contract(
      BSC_ORACLE_ABI,
      LEGACY_BSC_ORACLE_CONTRACT_FOR_GETTING_PRICES,
    );
    
    const contractForPricesByDefault = new this.bscWeb3.eth.Contract(
      BSC_ORACLE_ABI,
      DEFAULT_BSC_ORACLE_CONTRACT_FOR_GETTING_PRICES,
    );
    
    this.contractsForPrices = {
      default: contractForPricesByDefault,
      legacy: legacyContractForPrices,
    };
  }
  
  public async getPrice(
    tokenAddress: string,
    contractsForGettingPrices: CONTRACTS_FOR_PRICES_KEYS = 'default',
  ): Promise<BigNumber | null> {
    const gettingPricesContract = this.contractsForPrices[contractsForGettingPrices];
    
    const price: string | null = await this.blockchainService.makeRequest(
      gettingPricesContract,
      'getPrice',
      tokenAddress,
    );
    
    return price
      ? new BigNumber(price).dividedBy(10 ** PRICE_DECIMALS)
      : null;
  }
  
  public async getPriceUsingFactory(underlyingAddress: string): Promise<BigNumber | null> {
    if (!this.blockchainService.isValidAddress(underlyingAddress, this.bscWeb3)) {
      return null;
    }
    
    const underlyingContract = new this.bscWeb3.eth.Contract(
      BSC_UNDERLYING_ABI,
      underlyingAddress,
    );
    
    // TODO how to distinguish a network error from a non-existent method?
    // factory - determines which contract address should be used to get underlying token prices
    const factory: string | null = BSCContractsWithoutFactoryMethod.has(
      underlyingAddress.toLowerCase(),
    )
      ? null
      : await this.blockchainService.makeRequest(underlyingContract, 'factory');
    // if the smart contract does not have the Factori method (factory === null), then we use the default
    // DEFAULT_BSC_ORACLE_CONTRACT_FOR_GETTING_PRICES
    const oracleAddressForGettingPrices = factory?.toLowerCase() === LEGACY_BSC_FACTORY.toLowerCase()
      ? 'legacy'
      : 'default';
    
    // underlyingPrice - the price are in USD
    return await this.getPrice(
      underlyingAddress,
      oracleAddressForGettingPrices,
    );
  }
  
  public getAssetsFromVaults(
    vaults: Vault[],
    pools: Pool[],
    walletAddress: string,
    farmPrice: BigNumber | null,
  ): Promise<AssetsInfo>[] {
    return vaults.map(async (vault: Vault) => {
      const vaultRelatedPool = pools.find(pool => {
        return (
          vault.contract.address.toLowerCase() ===
          pool.lpToken?.address.toLowerCase()
        );
      });
      
      const partialAssetData = {
        underlyingAddress: this.blockchainService.calcUnderlying(
          vault,
          vaultRelatedPool,
        ),
      };
      
      if (vaultRelatedPool) {
        return this.getAssetsFromPool(
          vaultRelatedPool,
          walletAddress,
          farmPrice,
          partialAssetData,
          vault,
        );
      }
      
      const vaultContract = new this.bscWeb3.eth.Contract(
        FTOKEN_ABI,
        vault.contract.address,
      );
      
      const vaultBalance: string | null = await this.blockchainService.makeRequest(
        vaultContract,
        'balanceOf',
        walletAddress,
      );
      
      const prettyVaultBalance = vaultBalance && vault.decimals
        ? new BigNumber(vaultBalance).dividedBy(10 ** vault.decimals)
        : null;
      
      const totalSupply = vaultBalance && vaultBalance.toString() !== '0'
        ? await this.blockchainService.makeRequest(vaultContract, 'totalSupply')
        : null;
      
      const percentOfPool: BigNumber | null = totalSupply && vaultBalance && totalSupply.toString() !== '0'
        ? new BigNumber(vaultBalance)
          .dividedToIntegerBy(totalSupply)
          .multipliedBy(100)
        : null;
      
      const address = vault.contract.address;
      
      const name = vault.contract.name;
      
      return {
        id: address,
        network: BSC as typeof BSC,
        prettyName: name,
        name,
        earnFarm: !this.vaultsWithoutReward.has(vault.contract.name),
        farmToClaim: null,
        stakedBalance: null,
        percentOfPool,
        value: null,
        unstakedBalance: prettyVaultBalance,
        address: { vault: vault.contract.address },
        underlyingBalance: prettyVaultBalance,
        ...partialAssetData,
      };
    });
  }
  
  public async getAssetsFromPool(
    pool: Pool,
    walletAddress: string,
    bFarmPrice: BigNumber | null,
    partialAssetData: PartialAssetData,
    relatedVault?: Vault,
  ): Promise<AssetsInfo> {
    const lpTokenContract = new this.bscWeb3.eth.Contract(
      FTOKEN_ABI,
      pool.lpToken?.address,
    );
    
    const poolContract = new this.bscWeb3.eth.Contract(
      REWARDS_ABI,
      pool.contract.address,
    );
    
    /**
     * lpTokenBalance - balance of a wallet in the liquidity-pool
     * poolBalance - balance of a wallet in the pool
     * reward - reward of a wallet in the pool
     * pricePerFullShareLpToken = (nativeToken / fToken ) * 10 ** lpTokenDecimals
     */
    const [lpTokenBalance, poolBalance, reward] = await Promise.all<
      string | null,
      string | null,
      string | null
      >([
      this.blockchainService.makeRequest(
        lpTokenContract,
        'balanceOf',
        walletAddress,
      ),
      this.blockchainService.makeRequest(poolContract, 'balanceOf', walletAddress),
      this.blockchainService.makeRequest(poolContract, 'earned', walletAddress),
    ]);
    
    const prettyRewardTokenBalance =
      reward === null
        ? null
        : new BigNumber(reward).dividedBy(10 ** FARM_DECIMALS);
    
    const getDecimals = async (): Promise<string | null | number> => {
      if (relatedVault) {
        return relatedVault.decimals ? relatedVault.decimals : null;
      }
      
      return lpTokenBalance === '0' ||
      lpTokenBalance === null ||
      poolBalance === '0' ||
      poolBalance === null
        ? this.blockchainService.makeRequest(lpTokenContract, 'decimals')
        : null;
    };
    
    const priceAddress = relatedVault
      ? relatedVault.underlying?.address
      : pool.lpToken?.address;
    /**
     * poolTotalSupply - the total number of tokens in the pool of all participants
     */
    const [
      underlyingPrice,
      poolTotalSupply,
      lpTokenPricePerFullShare,
      lpTokenDecimals,
    ] = await Promise.all<
      BigNumber | null,
      string | null,
      string | null,
      number | string | null
      >([
      this.blockchainService.calcUnderlyingPrice(
        poolBalance,
        priceAddress,
        this.getPriceUsingFactory.bind(this),
      ),
      
      poolBalance !== '0'
        ? this.blockchainService.makeRequest(poolContract, 'totalSupply')
        : null,
      
      relatedVault && poolBalance !== '0'
        ? this.blockchainService.makeRequest(lpTokenContract, 'getPricePerFullShare')
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
    
    const lpTokenPrettyPricePerFullShare =
      lpTokenPricePerFullShare && lpTokenDecimals
        ? new BigNumber(lpTokenPricePerFullShare).dividedBy(
          10 ** Number(lpTokenDecimals),
        )
        : null;
    
    const percentOfPool =
      poolTotalSupply && poolBalance
        ? new BigNumber(poolBalance)
          .dividedBy(poolTotalSupply)
          .multipliedBy(100)
        : null;
    
    /** All account assets that contains in the pool are in USD */
    const calcValue = () => {
      return underlyingPrice !== null &&
      bFarmPrice &&
      prettyRewardTokenBalance &&
      prettyPoolBalance &&
      lpTokenPrettyPricePerFullShare
        ? underlyingPrice
          .multipliedBy(prettyPoolBalance)
          .multipliedBy(lpTokenPrettyPricePerFullShare)
          .plus(bFarmPrice.multipliedBy(prettyRewardTokenBalance))
        : null;
    };
    // fTokens balance in underlying Tokens;
    const underlyingBalance =
      prettyPoolBalance && lpTokenPrettyPricePerFullShare
        ? prettyPoolBalance.multipliedBy(lpTokenPrettyPricePerFullShare)
        : null;
    
    const address = relatedVault
      ? relatedVault.contract.address
      : pool.contract.address;
    
    // TODO: create pretty name list for BSC assets
    const name = relatedVault
      ? relatedVault.contract.name || 'no name'
      : pool.contract.name || 'no name';
    
    return {
      id: address,
      // typescript bug
      network: BSC as typeof BSC,
      prettyName: name,
      name,
      earnFarm: true,
      farmToClaim: prettyRewardTokenBalance,
      stakedBalance: prettyPoolBalance,
      percentOfPool,
      value: calcValue(),
      unstakedBalance: prettyLpTokenBalance,
      address: {
        vault: relatedVault?.contract.address,
        pool: pool.contract.address,
      },
      underlyingBalance,
      ...partialAssetData,
    };
  }
}
