import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalUsersDialogComponent } from './total-users-dialog.component';

describe('TotalUsersDialogComponent', () => {
  let component: TotalUsersDialogComponent;
  let fixture: ComponentFixture<TotalUsersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalUsersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
