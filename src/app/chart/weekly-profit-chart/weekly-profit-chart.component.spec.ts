import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProfitChartComponent } from './weekly-profit-chart.component';

describe('WeeklyProfitChartComponent', () => {
  let component: WeeklyProfitChartComponent;
  let fixture: ComponentFixture<WeeklyProfitChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyProfitChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyProfitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
