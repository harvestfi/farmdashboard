import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PsApyDialogComponent} from './ps-apy-dialog.component';

describe('RewardsDialogComponent', () => {
  let component: PsApyDialogComponent;
  let fixture: ComponentFixture<PsApyDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PsApyDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsApyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
