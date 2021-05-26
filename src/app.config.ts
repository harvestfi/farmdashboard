import {InjectionToken} from '@angular/core';

export class AppConfig {
    debugLevel: number;
    infuraKey: string;
    apiEndpoints = {};
    wsEndpoints = {};
    wsReconnectInterval: number;
    web3Url: string;
    multipleSources: boolean;
    defaultNetwork: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
