import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBalancesDialogComponent } from './user-balances-dialog.component';

describe('UserBalancesDialogComponent', () => {
  let component: UserBalancesDialogComponent;
  let fixture: ComponentFixture<UserBalancesDialogComponent>;

  beforeEach(async(() => {
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
