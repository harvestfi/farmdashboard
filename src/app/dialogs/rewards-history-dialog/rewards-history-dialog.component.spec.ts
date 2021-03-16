import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RewardsHistoryDialogComponent} from './rewards-history-dialog.component';
import {RewardDto} from "../../models/reward-dto";

describe('RewardsDialogComponent', () => {
  let component: RewardsHistoryDialogComponent;
  let fixture: ComponentFixture<RewardsHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RewardsHistoryDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
