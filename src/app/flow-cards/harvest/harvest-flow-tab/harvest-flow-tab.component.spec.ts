import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HarvestFlowTabComponent} from './harvest-flow-tab.component';

describe('HarvestFlowTabComponent', () => {
  let component: HarvestFlowTabComponent;
  let fixture: ComponentFixture<HarvestFlowTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestFlowTabComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestFlowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
