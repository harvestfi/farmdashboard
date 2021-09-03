import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProfitHistoryComponent } from './weekly-profit-history.component';

describe('WeeklyProfitHistoryComponent', () => {
  let component: WeeklyProfitHistoryComponent;
  let fixture: ComponentFixture<WeeklyProfitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyProfitHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyProfitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
