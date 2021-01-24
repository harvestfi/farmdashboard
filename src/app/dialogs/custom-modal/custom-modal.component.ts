import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css'],
  host: {
    '(document:mousemove)': 'mousemove($event)',
    '(window:resize)': 'handleWindowResize($event)',
    '(document:touchmove)': 'mousemove($event)'
  }
})
export class CustomModalComponent implements AfterViewInit {
  private isDown;
  private initialX: number;
  private initialY: number;
  private currentX: number;
  private currentY: number;
  private offsetX: number;
  private offsetY: number;
  @ViewChild('modal') private modal;

  constructor() {
    this.isDown = false;
    this.initialX;
    this.initialY;
    this.currentX;
    this.currentY;
    this.offsetX;
    this.offsetY;
  }

  ngAfterViewInit(): void {
    const style: Record<any, any> = this.modal.nativeElement.style;
    style.top = this.currentY + "px";
    style.left = this.currentX + "px";
  }

  mousedown($event): void {
    if ($event.target === this.modal.nativeElement) {
      if($event.type == "touchstart"){
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

    if($event.type == "touchmove") {
      this.currentX = $event.touches[0].clientX;
      this.currentY = $event.touches[0].clientY;
    } else {
      this.currentX = $event.clientX;
      this.currentY = $event.clientY;
    }
    if (this.isDown) {
      if ($event.preventDefault) $event.preventDefault();
      if ($event.stopPropagation) $event.stopPropagation();
      $event.cancelBubble = true;

      style.left = this.currentX + "px";
      style.top = this.currentY + "px";

      style.transform = `translate(-50%, -10%)`
      return;
    }

  }

  handleWindowResize($event) {
    const style: Record<any, any> = this.modal.nativeElement.style;
    const windowWidth: number = $event.target.innerWidth
    const windowHeight: number = $event.target.innerHeight
    const modalPosition: Record<any, any> = this.modal.nativeElement.getBoundingClientRect()
    if (modalPosition.right > windowWidth) {
      style.left = "50%";
    }
    if (modalPosition.bottom > windowHeight) {
      style.bottom = 0;
    }

  }
}



