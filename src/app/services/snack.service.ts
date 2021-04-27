import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {NGXLogger} from 'ngx-logger';
import {SnackBarComponent} from '../main/snack-bar/snack-bar.component';
import {ViewTypeService} from './view-type.service';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(public snackBar: MatSnackBar,
              public vt: ViewTypeService,
              private log: NGXLogger) {
  }

  public openSnack(message): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: 'snack-bar',
      duration: 10000,
      data: message,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  public dismiss(): void {
    this.snackBar.dismiss();
  }

  public getErrorText(e): string {
    let s = 'Error: ';
    if (e) {
      s += e.status;
    }
    if (e.error) {
      s += ': ' + e.error.message;
    }
    return s;
  }

  public handleError<T>(operation = 'operation', result?: T): (input: any) => Observable<T> {
    return (error: {error?: {message: string}}): Observable<T> => {
      this.dismiss();
      this.openSnack(this.getErrorText(error));
      this.log.error('Catch error:', error); // log to console instead
      if (error && error.error && error.error.message === 'Full authentication is required to access this resource') {
        // this.autoLogoutService.logout();
      }
      return of(result as T);
    };
  }
}
