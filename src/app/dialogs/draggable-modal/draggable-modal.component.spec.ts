import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DraggableModalComponent } from './draggable-modal.component';

describe('CustomModalComponent', () => {
  let component: DraggableModalComponent;
  let fixture: ComponentFixture<DraggableModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggableModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
