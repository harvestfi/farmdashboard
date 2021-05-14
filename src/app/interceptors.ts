import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpMetricsService} from './services/http-metrics.service';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export const interceptorProviders =
    [
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG},
        {provide: HTTP_INTERCEPTORS, useClass: HttpMetricsService, multi: true},
    ];
