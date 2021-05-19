export interface Network {
  name: string; // e.g. Ethereum Mainnet or Binance Smart Chain
  rpcUrl: string;
  chainId: number;
  ethparserName: string; // e.g. eth or bsc
  currencySymbol: string; // e.g. ETH or BNB
  blockExplorerUrl: string; // e.g. etherscan.io or bscscan.com
}
