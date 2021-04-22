import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {WeeklyProfitDialogComponent} from './weekly-profit-dialog.component';

describe('ProfitDialogComponent', () => {
  let component: WeeklyProfitDialogComponent;
  let fixture: ComponentFixture<WeeklyProfitDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyProfitDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyProfitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
