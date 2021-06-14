import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HardworkHistoryListDialogComponent} from './hardwork-history-list-dialog.component';

describe('HardWorkHistoryListDialogComponent', () => {
  let component: HardworkHistoryListDialogComponent;
  let fixture: ComponentFixture<HardworkHistoryListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HardworkHistoryListDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkHistoryListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
