import { InjectionToken } from '@angular/core';

export interface Platform {
  name: string;
  prefix: string;
}

export const platforms: Array<Platform> = [
  {
    name: 'Curve',
    prefix: 'CRV_',
  },
  {
    name: '1Inch',
    prefix: '1INCH_',
  },
  {
    name: 'Sushi',
    prefix: 'SUSHI_',
  },
  {
    name: 'Uniswap',
    prefix: 'UNI_',
  },
  {
    name: 'Ellipsis.finance',
    prefix: 'EPS_',
  },
  {
    name: 'Pancake',
    prefix: 'PCS_',
  },
  {
    name: 'Belt',
    prefix: 'BELT_',
  },
  {
    name: 'Balancer',
    prefix: 'BPT_',
  },
];

export const PLATFORM_LIST = new InjectionToken('PLATFORM_LIST');

export const assets = new Set<string>();

export const NETWORKS = [
  {
    label: 'Ethereum',
    value: 'eth',
  },
  {
    label: 'Binance',
    value: 'bsc',
  },
  {
    label: 'Matic',
    value: 'matic',
  },
];

export const TABLE_HEADERS = [
  {
    label: 'Network',
    isDesktopColumn: true,
  },
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'APY',
    value: 'apy',
    tooltip: `<p>APY with daily restake period</p>
      <i class="fa fa-bolt" style="color: goldenrod"></i>
      - weekly FARM reward active`,
  },
  {
    label: 'TVL',
    value: 'tvl',
    tooltip: 'Total Value Locked',
  },
  {
    label: 'Users',
    value: 'users',
    isDesktopColumn: true,
  },
  {
    label: 'Total Earned',
    value: 'total_earned',
    isDesktopColumn: true,
  },
  {
    label: 'Created',
    value: 'created',
    isDesktopColumn: true,
  },
];
