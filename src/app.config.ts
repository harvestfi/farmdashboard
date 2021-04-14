import {InjectionToken} from '@angular/core';

export class AppConfig {
    debugLevel: number;
    wsEndpoint: string;
    apiEndpoint: string;
    apiEndpoints = {};
    wsEndpoints = {};
    wsReconnectInterval: number;
    web3Url: string;
    multipleSources;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
