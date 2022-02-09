import BigNumber from 'bignumber.js';

export const ETH = 'eth';
export const BSC = 'bsc';

export interface AssetsInfo {
  id: string;
  network: typeof ETH | typeof BSC;
  name: string;
  prettyName: string;
  earnFarm: boolean;
  farmToClaim: BigNumber | null;
  stakedBalance: BigNumber | null;
  percentOfPool: BigNumber | null;
  value: BigNumber | null;
  unstakedBalance: BigNumber | null;
  address: {
    vault?: string
    pool?: string
  };
  underlyingBalance: BigNumber | null;
  underlyingAddress?: string;
  icon?: string;
  prettyFarmToClaim?: string;
  prettyPercentOfPool?: string;
  prettyValue?: string;
  prettyStakedBalance?: string;
  prettyUnderlyingBalance?: string;
  prettyUnstakedBalance?: string;
}

export interface PartialAssetData {
  underlyingAddress: AssetsInfo['underlyingAddress'];
}
