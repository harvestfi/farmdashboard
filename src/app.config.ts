import { InjectionToken } from '@angular/core'

export class AppConfig {
    debugLevel: number
    wsEndpoint: string
    apiEndpoint: string
    wsReconnectInterval: number
}

export let APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG')