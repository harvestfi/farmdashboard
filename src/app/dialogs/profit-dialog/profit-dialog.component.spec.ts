import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ProfitDialogComponent} from './profit-dialog.component';

describe('ProfitDialogComponent', () => {
  let component: ProfitDialogComponent;
  let fixture: ComponentFixture<ProfitDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
