import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BusyNotifierService} from '../../busy-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(private log: NGXLogger, private notifier: BusyNotifierService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          const message = `Network request [${req.url}] was bad...`;
          this.log.debug(message);
          this.notifier.failure(new Error(message));
          return throwError(error);
        })
    );
  }

}
