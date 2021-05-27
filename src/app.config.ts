import {InjectionToken} from '@angular/core';

export class AppConfig {
    debugLevel: number;
    apiEndpoints = {};
    wsEndpoints = {};
    wsReconnectInterval: number;
    ethRpcUrl: string;
    multipleSources: boolean;
    defaultNetwork: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
