import {EventEmitter, Inject, Injectable, OnDestroy} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {NGXLogger} from 'ngx-logger';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {BusyNotifierService} from './busy-notifier.service';

@Injectable({
    providedIn: 'root'
})
export class HttpMetricsService implements HttpInterceptor {

    private requestCounter = 0;

    constructor(private log: NGXLogger, private notifier: BusyNotifierService) {
    }

    private beginRequest() {
        this.requestCounter += 1;
        this.determineBusy();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.beginRequest();
        return next.handle(req).pipe(
            catchError((err, caught) => {
                this.notifier.failure(err);
                return caught;
            }),
            finalize(() => this.endRequest())
        );
    }

    private endRequest() {
        this.requestCounter -= 1;
        this.determineBusy();
    }

    private determineBusy(){
        this.notifier.setBusy(this.requestCounter > 0);
        console.log(`=====> Busy: ${this.requestCounter === 0}`);
    }
}
