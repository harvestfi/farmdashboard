import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ApyChartDialogComponent} from './apy-chart-dialog.component';

describe('IncomeDialogComponent', () => {
  let component: ApyChartDialogComponent;
  let fixture: ComponentFixture<ApyChartDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApyChartDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApyChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
