import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HarvestHistoryDialogComponent} from './harvest-history-dialog.component';

describe('HarvestHistoryDialogComponent', () => {
  let component: HarvestHistoryDialogComponent;
  let fixture: ComponentFixture<HarvestHistoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestHistoryDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
