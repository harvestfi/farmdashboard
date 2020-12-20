import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitDialogComponent } from './profit-dialog.component';

describe('ProfitDialogComponent', () => {
  let component: ProfitDialogComponent;
  let fixture: ComponentFixture<ProfitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitDialogComponent ]
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
