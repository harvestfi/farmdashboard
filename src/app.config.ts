import { InjectionToken } from '@angular/core';

export class AppConfig {
    debugLevel: number;
    wsEndpoint: string;
    apiEndpoint: string;
    wsReconnectInterval: number;
    web3Url: string;
};

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
