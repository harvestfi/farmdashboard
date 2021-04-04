import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {FarmChartComponent} from './farm-chart.component';

describe('PriceChartComponent', () => {
  let component: FarmChartComponent;
  let fixture: ComponentFixture<FarmChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FarmChartComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
