import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {HttpMetricsService} from './services/http/interceptors/http-metrics.service';
import {ErrorHandlerService} from './services/http/interceptors/error-handler.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export const interceptorProviders =
    [
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG},
        {provide: HTTP_INTERCEPTORS, useClass: HttpMetricsService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true},
    ];
