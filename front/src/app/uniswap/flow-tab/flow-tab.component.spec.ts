import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlowTabComponent} from './flow-tab.component';

describe('FlowTabComponent', () => {
  let component: FlowTabComponent;
  let fixture: ComponentFixture<FlowTabComponent>;

  beforeEach(async(() => {
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
