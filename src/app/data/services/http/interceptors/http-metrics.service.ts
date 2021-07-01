import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {BusyNotifierService} from '../../busy-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class HttpMetricsService implements HttpInterceptor {

  private requestCounter = 0;

  constructor(private log: NGXLogger, private notifier: BusyNotifierService) {
  }

  private beginRequest(): void {
    this.requestCounter += 1;
    this.determineBusy();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.beginRequest();
    return next.handle(req).pipe(
        finalize(() => this.endRequest())
    );
  }

  private endRequest(): void {
    this.requestCounter -= 1;
    this.determineBusy();
  }

  private determineBusy(): void {
    this.notifier.setBusy(this.requestCounter > 0);
  }
}
