import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-draggable-modal',
  templateUrl: './draggable-modal.component.html',
  styleUrls: ['./draggable-modal.component.css'],
  host: {
    '(document:mousemove)': 'mousemove($event)',
    '(window:resize)': 'handleWindowResize($event)',
    '(document:touchmove)': 'mousemove($event)',
  },
})
export class DraggableModalComponent {
  private isDown;
  private currentX: number;
  private currentY: number;
  private offsetX: number;
  private offsetY: number;
  @ViewChild('modal') private modal;

  constructor() {
    this.isDown = false;
    this.currentX = 0;
    this.currentY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  mousedown($event): void {
    if ($event.target === this.modal.nativeElement) {
      if ($event.type === 'touchstart') {
        this.offsetX = $event.touches[0].clientX;
        this.offsetY = $event.touches[0].clientY;
      } else {
        this.offsetX = $event.layerY;
        this.offsetY = $event.layerX;
      }
      this.isDown = true;
    }
  }
  mouseup($event): void {
    this.isDown = false;
  }

  mousemove($event): void {
    const style: Record<any, any> = this.modal.nativeElement.style;

    if ($event.type === 'touchmove') {
      this.currentX = $event.touches[0].clientX;
      this.currentY = $event.touches[0].clientY;
    } else {
      this.currentX = $event.clientX;
      this.currentY = $event.clientY;
    }
    if (this.isDown) {
      if ($event.preventDefault) {
        $event.preventDefault();
      }
      if ($event.stopPropagation) {
        $event.stopPropagation();
      }
      $event.cancelBubble = true;

      style.left = this.currentX + 'px';
      style.top = this.currentY + 'px';

      style.transform = 'translate(-50%, -10%)';
      return;
    }
  }

  handleWindowResize($event): void {
    const style: Record<any, any> = this.modal.nativeElement.style;
    const windowWidth: number = $event.target.innerWidth;
    const windowHeight: number = $event.target.innerHeight;
    const modalPosition: Record<
      any,
      any
    > = this.modal.nativeElement.getBoundingClientRect();
    if (modalPosition.right > windowWidth) {
      style.left = '50%';
    }
    if (modalPosition.bottom > windowHeight) {
      style.bottom = 0;
    }
  }
}
