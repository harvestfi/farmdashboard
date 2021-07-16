import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyNotifierService {

  busy: BehaviorSubject<boolean>;
  failures: BehaviorSubject<Error>;

  constructor() {
    this.busy = new BehaviorSubject<boolean>(false);
    this.busy.next(false);
    this.failures = new BehaviorSubject<Error>(null);
  }

  failure(e: Error): void {
    this.failures.next(e);
  }

  setBusy(busy: boolean): void {
    this.busy.next(busy);
  }

}
