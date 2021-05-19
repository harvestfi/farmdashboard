import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HardworkFlowTabComponent} from './hardwork-flow-tab.component';

describe('HardworkFlowTabComponent', () => {
  let component: HardworkFlowTabComponent;
  let fixture: ComponentFixture<HardworkFlowTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HardworkFlowTabComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkFlowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
