import {EventEmitter, Inject, Injectable, OnDestroy} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {NGXLogger} from 'ngx-logger';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {BusyNotifierService} from '../../busy-notifier.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

    constructor(private log: NGXLogger, private notifier: BusyNotifierService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if(event.status >= 400){
                        this.log.debug(`Network request [${req.url}] was bad...`);
                        this.notifier.failure(new Error('Network request was bad...'));
                    }
                }
                return event;
            })
        );
    }

}
