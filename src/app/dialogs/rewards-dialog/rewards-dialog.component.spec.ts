import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RewardsDialogComponent} from './rewards-dialog.component';

describe('RewardsDialogComponent', () => {
  let component: RewardsDialogComponent;
  let fixture: ComponentFixture<RewardsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RewardsDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
