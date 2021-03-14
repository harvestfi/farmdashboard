import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserBalancesDialogComponent } from './user-balances-dialog.component';

describe('UserBalancesDialogComponent', () => {
  let component: UserBalancesDialogComponent;
  let fixture: ComponentFixture<UserBalancesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBalancesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBalancesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
