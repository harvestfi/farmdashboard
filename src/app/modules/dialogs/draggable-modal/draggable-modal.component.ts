import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, Output, ViewChild } from '@angular/core';
import { ViewTypeService } from '@data/services/view-type.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-draggable-modal',
  templateUrl: './draggable-modal.component.html',
  styleUrls: ['./draggable-modal.component.css'],
})
export class DraggableModalComponent implements AfterViewInit, OnDestroy {
  @Output() dragged = new EventEmitter<boolean>();

  @ViewChild('modal') private modal;
  private positionOne = 0;
  private positionTwo = 0;
  private positionThree = 0;
  private positionFour = 0;
  private isMouseDown = false;
  private debounce: Subject<void> = new Subject<void>();
  private ngUnsubscribe = new Subject<boolean>();

  constructor(public vt: ViewTypeService) {
  }

  ngAfterViewInit(): void {
    const style = this.modal.nativeElement.style;
    style.top = '50%';
    style.left = '50%';
    style.transform = 'translate(-50%, -50%)';

    this.debounce
      .pipe(
        debounceTime(100),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.dragged.emit(false));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  mousedown(event): void {
    this.dragged.emit(true);

    if (event.target === this.modal.nativeElement) {
      if (event.type === 'touchmove') {
        this.positionThree = event.touches[0].clientX;
        this.positionFour = event.touches[0].clientY;
      } else {
        this.positionThree = event.clientX;
        this.positionFour = event.clientY;
      }
      this.isMouseDown = true;
    }
  }

  mouseup(): void {
    this.isMouseDown = false;

    this.debounce.next();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  mousemove(event): void {
    const element = this.modal.nativeElement;

    if (event.type === 'touchmove') {
      this.positionOne = this.positionThree - event.touches[0].clientX;
      this.positionTwo = this.positionFour - event.touches[0].clientY;
      this.positionThree = event.touches[0].clientX;
      this.positionFour = event.touches[0].clientY;
    } else {
      this.positionOne = this.positionThree - event.clientX;
      this.positionTwo = this.positionFour - event.clientY;
      this.positionThree = event.clientX;
      this.positionFour = event.clientY;
    }
    if (this.isMouseDown) {

      const { x: elementX, width } = this.modal.nativeElement.getBoundingClientRect();
      const hasScrollBar = (elementX + width + 30) > window.innerWidth;
      if (hasScrollBar && event.movementX > -1) {
        this.isMouseDown = false;
        return;
      }

      element.style.top = element.offsetTop - this.positionTwo + 'px';
      element.style.left = element.offsetLeft - this.positionOne + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(): void {
    const xLimit = window.innerWidth;
    const yLimit = window.innerHeight;
    const style: Record<any, any> = this.modal.nativeElement.style;
    const modalPosition: Record<any, any> = this.modal.nativeElement.getBoundingClientRect();
    if (modalPosition.right >= xLimit) {
      style.right = 0;
      style.left = 100;
      style.inset = 0;
      style.inset = '50%';
      style.transform = 'translate(-50%, -50%)';
    }
    if (modalPosition.bottom > yLimit) {
      style.bottom = 0;
      style.top = 100;
      style.inset = '50%';
      style.transform = 'translate(-50%, -50%)';
    }
  }
}
