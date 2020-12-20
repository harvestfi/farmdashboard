import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardLastValuesComponent} from './dashboard-last-values.component';

describe('DashboardLastValuesComponent', () => {
  let component: DashboardLastValuesComponent;
  let fixture: ComponentFixture<DashboardLastValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLastValuesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLastValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
