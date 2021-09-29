import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBalancesComponent } from './user-balances.component';

describe('UserBalancesComponent', () => {
  let component: UserBalancesComponent;
  let fixture: ComponentFixture<UserBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBalancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
