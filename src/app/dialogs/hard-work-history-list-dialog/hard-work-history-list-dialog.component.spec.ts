import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HardWorkHistoryListDialogComponent } from './hard-work-history-list-dialog.component';

describe('HardWorkHistoryListDialogComponent', () => {
  let component: HardWorkHistoryListDialogComponent;
  let fixture: ComponentFixture<HardWorkHistoryListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HardWorkHistoryListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardWorkHistoryListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
