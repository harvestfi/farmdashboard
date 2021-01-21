import {AfterViewInit, Component, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements AfterViewInit {
  private dragOffset;
  private isDown;
  @ViewChild('modal') private modal;

  constructor(private renderer: Renderer2) {
    this.isDown = false;
    this.dragOffset = [0, 0];
  }

  ngAfterViewInit(): void {
  }

  // todo fix drag and drop for APY window
  mousedown($event): void {
    this.isDown = true;
    const left = this.modal.nativeElement.offsetLeft - $event.clientX;
    const top = this.modal.nativeElement.offsetTop - $event.clientY;
    this.dragOffset = [
      left,
      top
    ];
  }

  mouseup($event): void {
    this.isDown = false;
  }

  mousemove($event): void {
    $event.preventDefault();

    if (this.isDown) {
      const style = this.modal.nativeElement.style;
      const left = ($event.clientX + this.dragOffset[0]) + 'px';
      const top = ($event.clientY + this.dragOffset[1]) + 'px';


      console.log('old pos', style.left, style.top);
      console.log('new positions', left, top);

      style.left = left;
      style.top = top;
      // this.renderer.setStyle(this.modal.nativeElement, 'left', left);
      // this.renderer.setStyle(this.modal.nativeElement, 'top', top);
    }
  }

}

