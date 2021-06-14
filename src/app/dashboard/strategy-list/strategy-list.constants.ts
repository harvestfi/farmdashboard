import {InjectionToken} from '@angular/core';

export interface Platform {
  name: string;
  prefix: string;
}

export const platforms: Array<Platform> = [
  {
    name: 'Curve',
    prefix: 'CRV_'
  },
  {
    name: '1Inch',
    prefix: '1INCH_'
  },
  {
    name: 'Sushi',
    prefix: 'SUSHI_'
  },
  {
    name: 'Uniswap',
    prefix: 'UNI_'
  },
  {
    name: 'Ellipsis.finance',
    prefix: 'EPS_'
  },
  {
    name: 'Pancake',
    prefix: 'PCS_'
  },
  {
    name: 'Belt',
    prefix: 'BELT_'
  },
  {
    name: 'Balancer',
    prefix: 'BPT_'
  },
];

export const PLATFORM_LIST = new InjectionToken('PLATFORM_LIST');

export const assets = new Set<string>();
