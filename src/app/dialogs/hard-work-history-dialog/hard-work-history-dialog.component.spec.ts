import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {HardWorkHistoryDialogComponent} from './hard-work-history-dialog.component';

describe('SavedFeesDialogComponent', () => {
  let component: HardWorkHistoryDialogComponent;
  let fixture: ComponentFixture<HardWorkHistoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HardWorkHistoryDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardWorkHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
