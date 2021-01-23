import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardWorkHistoryListDialogComponent } from './hard-work-history-list-dialog.component';

describe('HardWorkHistoryListDialogComponent', () => {
  let component: HardWorkHistoryListDialogComponent;
  let fixture: ComponentFixture<HardWorkHistoryListDialogComponent>;

  beforeEach(async(() => {
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
