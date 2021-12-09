import {InjectionToken} from '@angular/core';
import Web3 from 'web3';

export class AppConfig {
    debugLevel: number;
    apiEndpoints = {};
    wsEndpoints = {};
    wsReconnectInterval: number;
    ethRpcUrl: string;
    web3EthApi: string;
    multipleSources: boolean;
    defaultNetwork: string;
    theGraph: {
        graphQlServerUrl: string;
        graphQlAnalyticsUrl: string;
    };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
