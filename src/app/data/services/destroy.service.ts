import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DestroyService extends Observable<void> implements OnDestroy {
  private readonly life$: Subject<void> = new Subject();

  constructor() {
    super(subscriber => this.life$.subscribe(subscriber));
  }

  ngOnDestroy(): void {
    this.life$.next(null);
    this.life$.complete();
  }
}
