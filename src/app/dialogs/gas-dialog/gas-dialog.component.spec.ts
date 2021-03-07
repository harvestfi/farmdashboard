import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GasDialogComponent} from './gas-dialog.component';

describe('GasDialogComponent', () => {
  let component: GasDialogComponent;
  let fixture: ComponentFixture<GasDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GasDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
