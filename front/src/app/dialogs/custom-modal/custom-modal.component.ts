import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css'],
  host: {
    '(document:mousemove)': 'mousemove($event)'
  }
})
export class CustomModalComponent implements AfterViewInit {
  private isDown;
  private mousePosition: { x: number, y: number };
  private initialX: number;
  private initialY: number;
  private currentX: number;
  private currentY: number;
  private offsetX: number;
  private offsetY: number;
  @ViewChild('modal') private modal;

  constructor(private renderer: Renderer2) {
    this.isDown = false;
    this.initialX;
    this.initialY;
    this.currentX;
    this.currentY;
    this.offsetX;
    this.offsetY;
    this.mousePosition = {
      x: 0,
      y: 0
    }
  }

  ngAfterViewInit(): void {
    const style: Record<any, any> = this.modal.nativeElement.style;
    style.top = this.currentY + "px";
    style.left = this.currentX + "px";
  }

  // todo fix drag and drop for APY window
  mousedown($event): void {
    if ($event.stopPropagation) $event.stopPropagation();
    this.offsetX = $event.layerY;
    this.offsetY = $event.layerX;
    this.isDown = true;
  }
  mouseup($event): void {
    this.isDown = false;
  }

  mousemove($event): void {
    $event.preventDefault();
    const style: Record<any, any> = this.modal.nativeElement.style;
    this.currentX = $event.clientX;
    this.currentY = $event.clientY;
    if ($event.target === this.modal.nativeElement) {
      console.log(this.offsetY, this.offsetY)
      if (this.isDown) {

        style.left = this.currentX + "px";
        style.top = this.currentY + "px";
        style.opacity = 0.6

        style.transform = `translate(-50%, -10%)`
        return;
      }

      style.opacity = 1
    }
  }

}

