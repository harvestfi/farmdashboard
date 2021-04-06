import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {IncomeDialogComponent} from './income-dialog.component';

describe('IncomeDialogComponent', () => {
  let component: IncomeDialogComponent;
  let fixture: ComponentFixture<IncomeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
