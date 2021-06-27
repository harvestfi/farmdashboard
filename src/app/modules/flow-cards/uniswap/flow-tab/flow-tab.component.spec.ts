import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {FlowTabComponent} from './flow-tab.component';

describe('FlowTabComponent', () => {
  let component: FlowTabComponent;
  let fixture: ComponentFixture<FlowTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlowTabComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
