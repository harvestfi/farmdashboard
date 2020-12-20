import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FarmChartComponent} from './price-chart.component';

describe('PriceChartComponent', () => {
  let component: FarmChartComponent;
  let fixture: ComponentFixture<FarmChartComponent>;

  beforeEach(async(() => {
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
